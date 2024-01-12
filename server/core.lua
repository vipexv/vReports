OnlineStaff = {}
ActiveReports = {}

AddEventHandler("playerJoining", function(_srcString, _oldId)
    if source <= 0 then
        Debug("(Error) [eventHandler:playerJoining] source is nil, returning.")
        return
    end

    local playerName = GetPlayerName(source)

    if type(playerName) ~= "string" then
        return Debug("(Error) [eventHandler:playerJoining] Player name isn't a string, Player name type: ",
            type(playerName))
    end

    CPlayer:new(source)
end)
---@param identifiers table
---@param sourceIdentifiers table
---@return boolean
local function loopThroughIdentifiers(identifiers, sourceIdentifiers)
    if not identifiers or not sourceIdentifiers then
        return false
    end

    for _, bannedIdentifier in ipairs(identifiers) do
        for _, sourceIdentifier in ipairs(sourceIdentifiers) do
            if string.find(bannedIdentifier, sourceIdentifier) then
                Debug("Identifier found: ", bannedIdentifier)
                return true
            end
        end
    end

    return false
end

AddEventHandler("playerDropped", function(reason)
    if source <= 0 then
        return Debug("(Error) [eventHandler:playerDropped] Source is nil.")
    end

    if OnlineStaff[source] then
        local leaderboard = LoadLeaderboard()
        local identifiers = GetPlayerIdentifiersWithoutIP(source)

        if #leaderboard > 0 then
            for _, playerData in ipairs(leaderboard) do
                local identifierCheck = loopThroughIdentifiers(playerData.identifiers, identifiers)
                local staff = OnlineStaff[tonumber(source)]

                if not identifierCheck then
                    table.insert(leaderboard, {
                        name = GetPlayerName(staff.id),
                        identifiers = staff.identifiers,
                        concludedReports = staff.concludedReportsThisSession
                    })
                    Debug("[playerDropped] identifierCheck returned false, so we created one: ", json.encode(leaderboard))
                    SaveLeaderboard(leaderboard)
                else
                    playerData.concludedReports = playerData.concludedReports + staff.concludedReportsThisSession
                    SaveLeaderboard(leaderboard)
                    Debug("[playerDropped] identifierCheck returned true, so we updated the concludedReports value: ",
                        json.encode(leaderboard))
                end
            end
        else
            local staff = OnlineStaff[tonumber(source)]
            table.insert(leaderboard, {
                name = GetPlayerName(staff.id),
                identifiers = staff.identifiers,
                concludedReports = staff.concludedReportsThisSession
            })
            SaveLeaderboard(leaderboard)
            Debug("[playerDropped] leaderboard was null, so we just instantly stored the first data ever :o.")
        end

        OnlineStaff[source] = nil
        Debug(("[eventHandler:playerDropped] %s was removed from the OnlineStaff table."):format(GetPlayerName(source)))
    end
end)

SetTimeout(1000, function()
    Debug("[Thread:LoopPlayerList] beginning.")
    CreateThread(function()
        local Players = GetPlayers()
        for i = 1, #Players do
            local player = Players[i]
            if OnlineStaff[player] then
                return Debug(("(Error) [Thread:LoopPlayerList] %s (ID - %s) is already in the OnlineStaff table.")
                    :format(GetPlayerName(player), player))
            end

            CPlayer:new(player)
        end
    end)
end)
