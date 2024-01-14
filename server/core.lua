---@type OnlineStaff[]
OnlineStaff = {}

---@type ActiveReport[]
ActiveReports = {}

-- Improved Event Handler for Player Joining
AddEventHandler("playerJoining", function(_srcString, _oldId)
    if source <= 0 then
        Debug("(Error) [eventHandler:playerJoining] Invalid source ID.")
        return
    end

    local playerName = GetPlayerName(source)

    if type(playerName) ~= "string" then
        Debug("(Error) [eventHandler:playerJoining] Invalid player name type: ", type(playerName))
        return
    end

    CPlayer:new(source)
end)

-- Function to Loop Through Identifiers
---@param identifiers table
---@param sourceIdentifiers table
---@return boolean
local function loopThroughIdentifiers(identifiers, sourceIdentifiers)
    if not identifiers or not sourceIdentifiers then
        return false
    end

    for _, bannedIdentifier in ipairs(identifiers) do
        for _, sourceIdentifier in ipairs(sourceIdentifiers) do
            if string.find(sourceIdentifier, bannedIdentifier) then
                Debug("Identifier found: ", bannedIdentifier)
                return true
            end
        end
    end

    return false
end

-- Improved Event Handler for Player Dropped
AddEventHandler("playerDropped", function(reason)
    if source <= 0 then
        Debug("(Error) [eventHandler:playerDropped] Invalid source ID.")
        return
    end

    local staff = OnlineStaff[source]
    if staff then
        local leaderboard = LoadLeaderboard() or {}
        local identifiers = GetPlayerIdentifiersWithoutIP(source)

        local found = false
        for _, playerData in ipairs(leaderboard) do
            if loopThroughIdentifiers(playerData.identifiers, identifiers) then
                playerData.concludedReports = playerData.concludedReports + staff.concludedReportsThisSession
                found = true
                break
            end
        end

        if not found then
            table.insert(leaderboard, {
                name = GetPlayerName(staff.id),
                identifiers = staff.identifiers,
                concludedReports = staff.concludedReportsThisSession
            })
        end

        SaveLeaderboard(leaderboard)
        OnlineStaff[source] = nil
        Debug(("[eventHandler:playerDropped] %s was removed from the OnlineStaff table."):format(GetPlayerName(source)))
    end
end)

-- Improved Timeout Function
SetTimeout(1000, function()
    Debug("[Thread:LoopPlayerList] Starting.")
    CreateThread(function()
        local Players = GetPlayers()
        for _, player in ipairs(Players) do
            if not OnlineStaff[player] then
                CPlayer:new(player)
            else
            Debug(("(Error) [Thread:LoopPlayerList] %s (ID - %s) is already in the OnlineStaff table.")
                :format(GetPlayerName(player), player))
        end
    end
end)
