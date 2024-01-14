-- Function to Load Leaderboard Data
---@return table | any
LoadLeaderboard = function()
    local leaderboardJson = LoadResourceFile(GetCurrentResourceName(), "data.json")
    if not leaderboardJson then 
        Debug("[func:LoadLeaderboard] leaderboardJson is null.") 
        return {}
    end
    return json.decode(leaderboardJson)
end

-- Function to Save Leaderboard Data
SaveLeaderboard = function(newLeaderboardTable)
    SaveResourceFile(GetCurrentResourceName(), "data.json", json.encode(newLeaderboardTable, { indent = false }), -1)
end

-- Function to Show Notification to a Player
ShowNotification = function(data)
    if not data then 
        Debug("[func:server:ShowNotification] first param is null.") 
        return 
    end

    if not data.target then 
        Debug("[func:server:ShowNotification] data.target is null.") 
        return
    end

    TriggerClientEvent("UIMessage", data.target, "nui:notify", data)
end

-- Function to Retrieve a Player's Discord ID
GetDiscordID = function(source)
    for idIndex = 1, GetNumPlayerIdentifiers(source) do
        local identifier = GetPlayerIdentifier(source, idIndex)
        if identifier and identifier:sub(1, #"discord:") == "discord:" then
            return identifier:gsub("discord:", "")
        end
    end
    return nil
end

-- Function to Get Player Identifiers Excluding IP Address
GetPlayerIdentifiersWithoutIP = function(player)
    local identifiers = GetPlayerIdentifiers(player)
    local cleanedIdentifiers = {}
    for _, identifier in ipairs(identifiers) do
        if not identifier:find("ip:") then
            table.insert(cleanedIdentifiers, identifier)
        end
    end
    return cleanedIdentifiers
end

-- Version Check Function
VersionCheck = function(repository)
    local resource = GetInvokingResource() or GetCurrentResourceName()
    local currentVersion = 'v1.0.1' -- Current version of your resource

    if currentVersion then
        currentVersion = currentVersion:match('%d+%.%d+%.%d+')
    end

    if not currentVersion then
        print(("^1Unable to determine current resource version for '%s' ^0"):format(resource))
        return
    end

    SetTimeout(1000, function()
        PerformHttpRequest(('https://api.github.com/repos/%s/releases/latest'):format(repository),
            function(status, response)
                if status ~= 200 then return end

                response = json.decode(response)
                if response.prerelease then return end

                local latestVersion = response.tag_name:match('%d+%.%d+%.%d+')
                if not latestVersion or latestVersion == currentVersion then return end

                local cv = { string.strsplit('.', currentVersion) }
                local lv = { string.strsplit('.', latestVersion) }

                for i = 1, #cv do
                    local current, minimum = tonumber(cv[i]), tonumber(lv[i])
                    if current < minimum then
                        print(('^3An update is available for %s (current version: %s)\n%s^0'):format(
                            resource, currentVersion, response.html_url))
                        return
                    elseif current > minimum then
                        break
                    end
                end
            end, 'GET')
    end)
end

-- UI Load Check
if not LoadResourceFile(GetCurrentResourceName(), 'web/dist/index.html') then
    local err = 'Unable to load UI. Build vReports or download the latest release.\n https://github.com/vipexv/vReports/releases/latest'
    print(err)
end

-- Call to Version Check Function
VersionCheck("vipexv/vReports")
