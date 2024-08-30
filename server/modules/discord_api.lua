local formattedToken = ("Bot %s"):format(SVConfig["Bot Token"])

local error_codes_defined = {
    [200] = 'OK - The request was completed successfully..!',
    [204] = 'OK - No Content',
    [400] = "Error - The request was improperly formatted, or the server couldn't understand it..!",
    [401] =
    'Error - The Authorization header was missing or invalid..! Your Discord Token is probably wrong or does not have correct permissions attributed to it.',
    [403] =
    'Error - The Authorization token you passed did not have permission to the resource..! Your Discord Token is probably wrong or does not have correct permissions attributed to it.',
    [404] = "Error - The resource at the location specified doesn't exist.",
    [429] =
    'Error - Too many requests, you hit the Discord rate limit. https://discord.com/developers/docs/topics/rate-limits',
    [502] = 'Error - Discord API may be down?...'
};

local discordRequest = function(method, endpoint, jsondata, reason)
    local data = nil
    PerformHttpRequest(("https://discord.com/api/%s"):format(endpoint), function(err, resultData, resultHeaders)
            data = {
                data = resultData,
                code = err,
                headers = resultHeaders
            }
        end, method, #jsondata > 0 and jsondata or "",
        {
            ["Content-Type"] = "application/json",
            ["Authorization"] = formattedToken,
            ["X-Audit-Log-Reason"] = reason
        })

    while not data do
        Wait(100)
    end

    return data
end

GetGuildData = function()
    local fetchGuildData = discordRequest("GET", ("guilds/%s"):format(SVConfig["Guild ID"]), {})

    if not fetchGuildData.code == 200 then
        return Debug(error_codes_defined[fetchGuildData.code])
    end

    local guildData = json.decode(fetchGuildData.data)

    return guildData
end

GetDiscordAvatar = function(discord_id, player_id)
    local img_url = nil

    if not discord_id then
        return Debug("[func:GetDiscordAvatar] called but the first param is nil.")
    end

    local fetchMemberData = discordRequest("GET", ("users/%s"):format(discord_id), {})

    if not fetchMemberData.code == 200 then
        return Debug(error_codes_defined[fetchMemberData.code])
    end

    local memberData = json.decode(fetchMemberData.data)

    if not memberData then
        return Debug("[func:GetDiscordAvatar] memberData is nil.")
    end

    local isGif = (memberData.avatar:sub(1, 1) and memberData.avatar:sub(2, 2) == "_" and "gif" or "png")

    Debug("[func:GetDiscordAvatar] isGif:", isGif)

    img_url = ("https://cdn.discordapp.com/avatars/%s/%s.%s"):format(discord_id, memberData.avatar, isGif)

    Debug("[func:GetDiscordAvatar] memberData: ", json.encode(memberData))

    Debug("[func:GetDiscordAvatar] img_url: ", img_url)

    return img_url
end

GetDiscordRoles = function(discord_id, player_id)
    if not discord_id then
        return Debug("[func:GetDiscordRoles] first param is nil.")
    end

    local fetchMemberData = discordRequest("GET", ("guilds/%s/members/%s"):format(SVConfig["Guild ID"], discord_id), {})

    if not fetchMemberData.code == 200 then
        return Debug(error_codes_defined[fetchMemberData.code])
    end

    local memberData = json.decode(fetchMemberData.data)

    return memberData.roles or {}
end
