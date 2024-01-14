RegisterNetEvent("reportmenu:server:report", function(data)
    if not data then return Debug("[netEvent:reportmenu:server:report] first param is null.") end
    local chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    local rint_char = math.random(1, #chars)
    local rchar = chars:sub(rint_char, rint_char)

    -- This isn't a really good generator but it works for now, i'll re-work it later, but if you have more than 5k reports active i don't know what to tell you.
    local rint_num = math.random(1, 5000)

    local reportId = tostring(rchar .. rint_num)

    data.id = source
    data.timedate = ("%s | %s"):format(os.date("%X"), os.date("%x"))
    data.reportId = reportId

    ActiveReports[reportId] = data

    TriggerClientEvent("reportmenu:client:addactivereport", source, data)

    for k, v in pairs(OnlineStaff) do
        ---@diagnostic disable-next-line: param-type-mismatch
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

RegisterNetEvent("reportmenu:server:cb:leaderboard", function()
    if not OnlineStaff[tonumber(source)] then
        return Debug(
            ("[reportmenu:server:cb:leaderboard] %s (ID -%s) Isn't a staff member but somehow called the event.")
            :format(GetPlayerName(source), source))
    end

    local leaderboard = LoadLeaderboard()

    TriggerClientEvent("reportmenu:client:cb:leaderboard", source, leaderboard)
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

    local thisReport = ActiveReports[data.reportId]

    if data.isMyReportsPage and thisReport then
        if tonumber(thisReport.id) ~= tonumber(source) then
            return Debug(
                "(reportmenu:server:delete) Player attempted to delete a report but it wasn't them who sent it.")
        end
    end

    if not data.isMyReportsPage and thisReport then
        local staff = OnlineStaff[tonumber(source)]
        staff.concludedReportsThisSession = staff.concludedReportsThisSession + 1

        Debug("[reportmenu:server:delete] concludedReportsThisSession value has been incremented", json.encode(staff))
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

        ActiveReports[data.reportId] = nil

        Debug("ActiveReport with the ID: ", data.reportId, "was found and was deleted.")

        TriggerClientEvent("staffchat:client:removemyreport", data.id, data)

        for k, v in pairs(OnlineStaff) do
            ---@diagnostic disable-next-line: param-type-mismatch Reason: it works, even if it's a string or a number.
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

RegisterNetEvent("reportmenu:server:sendmessage", function(data)
    if not data then return Debug("[reportmenu:server:sendmessage] missing first param") end

    local srcNumber = tonumber(source)

    ---@type ActiveReport
    local report = data.report

    if not OnlineStaff[srcNumber] or tonumber(report.id) ~= srcNumber then
        return Debug("[reportmenu:server:sendmessage] Insufficient access perms from source.")
    end

    local targetReport = ActiveReports[report.reportId]

    if not targetReport then return Debug("[reportmenu:server:sendmessage] report not found.") end

    if not targetReport.messages then
        ActiveReports[report.reportId].messages = {}
    end

    ActiveReports[report.reportId].messages[#ActiveReports[report.reportId].messages + 1] = {
        playerName = GetPlayerName(source),
        playerId = source,
        data = data.messageQuery,
        timedate = ("%s | %s"):format(os.date("%X"), os.date("%x"))
    }

    TriggerClientEvent("reportmenu:client:updateactivereport", source, ActiveReports[report.reportId])

    for _, v in pairs(OnlineStaff) do
        ShowNotification({
            target = v.id,
            title = "Report Menu | New Message",
            description = ("New Message in Report: [%s]"):format(report.reportId)
        })

        ---@diagnostic disable-next-line: param-type-mismatch Reason: it works, even if it's a string or a number.
        TriggerClientEvent("reportmenu:client:update", v.id, ActiveReports)
    end
end)
