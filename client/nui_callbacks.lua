RegisterNuiCallback('hideFrame', function(_, cb)
    ToggleNuiFrame(false)
    UIMessage("nui:resetstates")
    Debug('[nuicb:hideFrame] called')
    cb({})
end)

-- ex.
RegisterNuiCallback('getClientData', function(data, cb)
    local curCoords = GetEntityCoords(PlayerPedId())

    local retData <const> = { x = curCoords.x, y = curCoords.y, z = curCoords.z }
    cb(retData)
end)

RegisterNuiCallback("reportmenu:nuicb:sendreport", function(data, cb)
    if not data then return Debug("[reportmenu:nuicb:sendreport] first param is null.") end
    Debug("[reportmenu:nuicb:sendreport] Data param: ", json.encode(data))

    data.playerName = GetPlayerName(PlayerId())

    if data.reportNearestPlayers then
        data.nearestPlayers = {}
        local players = GetActivePlayers()
        local srcPlayerId = PlayerId()
        local srcPed = PlayerPedId()
        local srcCoords = GetEntityCoords(srcPed)

        for i = 1, #players do
            local playerId = players[i]
            local playerPed = GetPlayerPed(playerId)
            local playerCoords = GetEntityCoords(playerPed)

            local distance = #(srcCoords - playerCoords)

            if playerId ~= srcPlayerId and distance <= Config.MaxDistance then
                data.nearestPlayers[#data.nearestPlayers + 1] = {
                    id = GetPlayerServerId(playerId),
                    name = GetPlayerName(playerId),
                    distance = math.floor(distance),
                }

                Debug("[reportmenu:nuicb:sendreport] Player near us found: ", json.encode(data.nearestPlayers))
            end
        end
    end

    TriggerServerEvent("reportmenu:server:report", data)
    cb({})
end)

RegisterNuiCallback("reportmenu:nuicb:delete", function(data, cb)
    if not data then return Debug("[reportmenu:nuicb:delete] first param is null.") end

    -- if data.isMyReportsPage and MyReports[data.randomKey] then
    --     MyReports[data.randomKey] = nil
    --     UIMessage("nui:state:myreports", MyReports)
    --     Debug("(reportmenu:nuicb:delete) Report deleted on the client sided `MyReports` table.")
    -- end

    TriggerServerEvent("reportmenu:server:delete", data)

    cb({})
end)

RegisterNuiCallback("reportmenu:nui:cb:settings", function(data, cb)
    if not data then return Debug("[reportmenu:nui:cb:settings] first param is null.") end

    local settings = json.encode(data)

    SetResourceKvp("reportmenu:settings", settings)
    Debug("Settings loaded: ", data)

    Debug("[reportmenu:nui:cb:settings] Settings updated: ", settings)
    cb({})
end)

RegisterNuiCallback("reportmenu:nuicb:goto", function(data, cb)
    if not data then return Debug("[reportmenu:nuicb:goto] first param is null.") end

    TriggerServerEvent("reportmenu:server:goto", data)

    cb({})
end)

RegisterNuiCallback("reportmenu:nuicb:bring", function(data, cb)
    if not data then return Debug("[reportmenu:nuicb:goto] first param is null.") end

    TriggerServerEvent("reportmenu:server:bring", data)

    cb({})
end)

RegisterNuiCallback("reportmenu:nuicb:refresh", function(data, cb)
    Debug("[reportmenu:nuicb:refresh] Called.")
    TriggerServerEvent("reportmenu:server:cb:reports")
    cb({})
end)
