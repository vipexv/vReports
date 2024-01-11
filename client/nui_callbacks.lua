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
