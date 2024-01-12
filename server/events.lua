RegisterNetEvent("reportmenu:server:report", function(data)
    if not data then return Debug("[netEvent:reportmenu:server:report] first param is null.") end
    local randomKey = math.random(100000, 999999)

    data.id = source
    data.timedate = ("%s | %s"):format(os.date("%X"), os.date("%x"))
    data.randomKey = randomKey
    ActiveReports[randomKey] = data

    TriggerClientEvent("reportmenu:client:addactivereport", source, data)

    for k, v in pairs(OnlineStaff) do
        TriggerClientEvent("reportmenu:client:update", v.id, ActiveReports)
        ShowNotification(
            {
                title = "Report Menu",
                description = "New Report Recieved.",
                target = v.id,
                appearOnlyWhenNuiNotOpen = true
            }
        )
    end

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
    if not OnlineStaff[tonumber(source)] and not data.isMyReportsPage then
        return Debug(
            ("[netEvent:reportmenu:server:delete] %s (ID -%s) Isn't a staff member but somehow called the event.")
            :format(GetPlayerName(source), source))
    end

    local thisReport = ActiveReports[data.randomKey]

    if data.isMyReportsPage and thisReport then
        if tonumber(thisReport.id) ~= tonumber(source) then
            return Debug(
                "(reportmenu:server:delete) Player attempted to delete a report but it wasn't them who sent it.")
        end
    end

    if thisReport then
        ShowNotification(
            {
                title = "Report Menu",
                description = data.isMyReportsPage and "You have closed this report." or
                    ("Your report has been closed by %s (ID - %s)"):format(GetPlayerName(source), source),
                target = data.id,
            }
        )

        ActiveReports[data.randomKey] = nil

        Debug("ActiveReport with the ID: ", data.randomKey, "was found and was deleted.")

        TriggerClientEvent("staffchat:client:removemyreport", data.id, data)

        for k, v in pairs(OnlineStaff) do
            TriggerClientEvent("reportmenu:client:update", v.id, ActiveReports)
        end
    end
end)

RegisterNetEvent("reportmenu:server:goto", function(data)
    if not OnlineStaff[tonumber(source)] then
        return Debug(
            ("[netEvent:reportmenu:server:goto] %s (ID -%s) Isn't a staff member but somehow called the event.")
            :format(GetPlayerName(source), source))
    end

    local targetPed = GetPlayerPed(data.id)

    if not targetPed then
        return ShowNotification(
            {
                title = "Error Encountered",
                description = "Couldn't get the Target Ped",
                target = source
            }
        )
    end

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

    if not targetPed then
        return ShowNotification(
            {
                title = "Error Encountered",
                description = "Couldn't get the Target Ped",
                target = source
            }
        )
    end

    if not srcPed then return Debug("[reportmenu:server:bring] srcPed is somehow null.") end

    local srcPedCoords = GetEntityCoords(srcPed)

    Debug("source Routing Bucket: ", GetPlayerRoutingBucket(source), " \n target Routing Bucket: ",
        GetPlayerRoutingBucket(data.id))

    SetEntityCoords(targetPed, srcPedCoords.x, srcPedCoords.y, srcPedCoords.z, true, false, false, false)
end)
