RegisterNUICallback('hideFrame', function(_, cb)
    ToggleNuiFrame(false)
    Debug('[nuicb:hideFrame] called')
    cb({})
end)

-- ex.
RegisterNUICallback('getClientData', function(data, cb)
    local curCoords = GetEntityCoords(PlayerPedId())

    local retData <const> = { x = curCoords.x, y = curCoords.y, z = curCoords.z }
    cb(retData)
end)

RegisterNuiCallback("reportmenu:nuicb:sendreport", function(data, cb)
    if not data then return Debug("[reportmenu:nuicb:sendreport] first param is null.") end
    Debug("[reportmenu:nuicb:sendreport] Data param: ", json.encode(data))

    data.playerName = GetPlayerName(PlayerId())

    TriggerServerEvent("reportmenu:server:report", data)
    cb({})
end)

RegisterNetEvent("reportmenu:nuicb:refresh", function(data, cb)
    Debug("[reportmenu:nuicb:refresh] Called.")
    TriggerServerEvent("reportmenu:server:cb:reports")
    cb({})
end)
