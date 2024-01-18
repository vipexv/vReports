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

AddEventHandler("playerDropped", function(reason)
    if OnlineStaff[source] then
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
