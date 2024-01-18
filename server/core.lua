---@type OnlineStaff[]
OnlineStaff = {}

---@type ActiveReport[]
ActiveReports = {}

AddEventHandler("playerJoining", function(_srcString, _oldId)
    if source <= 0 then
        Debug("(Error) [eventHandler:playerJoining] source is nil, returning.")
        return
    end

    local playerName = GetPlayerName(source)

    if type(playerName) ~= "string" then
        return Debug("(Error) [eventHandler:playerJoining] Invalid Player name type: ",
            type(playerName))
    end

    CPlayer:new(source)
end)

---@param targetIdentifiers table
---@param sourceIdentifiers table
---@return boolean
local loopThroughIdentifiers = function(targetIdentifiers, sourceIdentifiers)
    if not targetIdentifiers or not sourceIdentifiers then
        return false
    end

    for i = 1, #targetIdentifiers do
        local targetIdentifier = targetIdentifiers[i]
        for u = 1, #sourceIdentifiers do
            local sourceIdentifier = sourceIdentifiers[u]
            if string.find(targetIdentifier, sourceIdentifier) then
                Debug("Identifier found: ", targetIdentifier)
                return true
            end
        end
    end

    -- for _, targetIdentifier in ipairs(targetIdentifiers) do
    --     for _, sourceIdentifier in ipairs(sourceIdentifiers) do
    --         if string.find(targetIdentifier, sourceIdentifier) then
    --             Debug("Identifier found: ", targetIdentifier)
    --             return true
    --         end
    --     end
    -- end

    return false
end

AddEventHandler("playerDropped", function(reason)
    if OnlineStaff[source] then
        local leaderboard = LoadLeaderboard()
        local identifiers = GetPlayerIdentifiersWithoutIP(source)

        if not leaderboard then
            local staff = OnlineStaff[tonumber(source)]
            table.insert(leaderboard, {
                name = GetPlayerName(staff.id),
                identifiers = staff.identifiers,
                concludedReports = staff.concludedReportsThisSession
            })
            SaveLeaderboard(leaderboard)
            Debug("[playerDropped] leaderboard was null, so we just instantly stored the first data ever :o.")
        else
            for i = 1, #leaderboard do
                local playerData = leaderboard[i]
                local findPlayerInLeaderboard = loopThroughIdentifiers(playerData.identifiers, identifiers)
                local staff = OnlineStaff[tonumber(source)]

                if not findPlayerInLeaderboard then
                    leaderboard[#leaderboard + 1] = {
                        name = GetPlayerName(staff.id),
                        identifiers = staff.identifiers,
                        concludedReports = staff.concludedReportsThisSession
                    }
                else
                    playerData.concludedReports = playerData.concludedReports + staff.concludedReportsThisSession
                end
            end
        end

        SaveLeaderboard(leaderboard)
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
