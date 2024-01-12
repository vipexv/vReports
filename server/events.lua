RegisterNetEvent("reportmenu:server:report", function(data)
    if not data then return Debug("[netEvent:reportmenu:server:report] first param is null.") end

    data.id = source
    data.timedate = os.date("%c")


    ActiveReports[tonumber(source)] = data

    Debug("[netEvent:reportmenu:server:report] Active Reports table: ", json.encode(ActiveReports))
end)

RegisterNetEvent("reportmenu:server:cb:reports", function()
    if not OnlineStaff[tonumber(source)] then
        return Debug(
            "[netEvent:reportmenu:server:reports] %s (ID -%s) Isn't a staff member but somehow called the event.")
    end

    TriggerClientEvent("reportmenu:client:cb:reports", source, ActiveReports)
end)
