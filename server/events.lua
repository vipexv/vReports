RegisterNetEvent("reportmenu:server:report", function(data)
    if not data then return Debug("[netEvent:reportmenu:server:report] first param is null.") end

    data.id = source
    data.timedate = ("%s | %s"):format(os.date("%X"), os.date("%x"))

    ActiveReports[tonumber(source)] = data

    -- for i = 1, #OnlineStaff do
    --     local staff = OnlineStaff[i]
    --     TriggerClientEvent("reportmenu:client:update", staff.id, ActiveReports)
    -- end

    Debug("[netEvent:reportmenu:server:report] Active Reports table: ", json.encode(ActiveReports))
end)

RegisterNetEvent("reportmenu:server:cb:reports", function()
    if not OnlineStaff[tonumber(source)] then
        return Debug(
            ("[netEvent:reportmenu:server:reports] %s (ID -%s) Isn't a staff member but somehow called the event.")
            :format(GetPlayerName(source), source))
    end

    TriggerClientEvent("reportmenu:client:cb:reports", source, ActiveReports)
end)

RegisterNetEvent("reportmenu:server:delete", function(data)
    if not OnlineStaff[tonumber(source)] then
        return Debug(
            ("[netEvent:reportmenu:server:delete] %s (ID -%s) Isn't a staff member but somehow called the event.")
            :format(GetPlayerName(source), source))
    end

    if ActiveReports[tonumber(data.id)] then
        ActiveReports[tonumber(data.id)] = nil
        Debug("ActiveReport with the ID: ", data.id, "was found and was deleted.")

        -- for i = 1, #OnlineStaff do
        --     local staff = OnlineStaff[i]
        --     TriggerClientEvent("reportmenu:client:update", staff.id, ActiveReports)
        -- end
    end
end)

RegisterNetEvent("reportmenu:server:goto", function(data)
    if not OnlineStaff[tonumber(source)] then
        return Debug(
            ("[netEvent:reportmenu:server:goto] %s (ID -%s) Isn't a staff member but somehow called the event.")
            :format(GetPlayerName(source), source))
    end

    local targetPed = GetPlayerPed(data.id)

    if not targetPed then return Debug("[reportmenu:server:goto] targetPed is null.") end

    local srcPed = GetPlayerPed(source)

    if not srcPed then return Debug("[reportmenu:server:goto] srcPed is somehow null.") end

    local targetPedCoords = GetEntityCoords(targetPed)

    Debug("source Routing Bucket: ", GetPlayerRoutingBucket(source), " \n target Routing Bucket: ",
        GetPlayerRoutingBucket(data.id))

    SetEntityCoords(srcPed, targetPedCoords.x, targetPedCoords.y, targetPedCoords.z, true, false, false, false)
end)


RegisterNetEvent("reportmenu:server:bring", function(data)
    if not OnlineStaff[tonumber(source)] then
        return Debug(
            ("[netEvent:reportmenu:server:bring] %s (ID -%s) Isn't a staff member but somehow called the event.")
            :format(GetPlayerName(source), source))
    end

    local srcPed = GetPlayerPed(source)
    local targetPed = GetPlayerPed(data.id)

    if not targetPed then return Debug("[reportmenu:server:bring] targetPed is null.") end
    if not srcPed then return Debug("[reportmenu:server:bring] srcPed is somehow null.") end

    local srcPedCoords = GetEntityCoords(srcPed)

    Debug("source Routing Bucket: ", GetPlayerRoutingBucket(source), " \n target Routing Bucket: ",
        GetPlayerRoutingBucket(data.id))

    SetEntityCoords(targetPed, srcPedCoords.x, srcPedCoords.y, srcPedCoords.z, true, false, false, false)
end)
