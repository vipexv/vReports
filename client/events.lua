RegisterNetEvent("UIMessage", function(action, data)
    UIMessage(action, data)

    Debug("(netEvent) [UIMessage] \n (param) action: ", json.encode(action), "\n (param) data: ", json.encode(data),
        "\n Invoking Resource: ",
        GetInvokingResource())
end)

RegisterNetEvent("reportmenu:state:playerdata", function(data)
    PlayerData = data

    Debug("[event:reportmenu:state:playerdata] data param: ", json.encode(data))
end)

RegisterNetEvent("reportmenu:client:cb:reports", function(activeReports)
    if not activeReports then return Debug("[reportmenu:client:cb:reports] First param is null.") end

    UIMessage("nui:state:reports", activeReports)
end)


RegisterNetEvent("reportmenu:client:update", function(activeReports)
    if not activeReports then return Debug("[reportmenu:client:cb:update] First param is null.") end

    UIMessage("nui:state:reports", activeReports)
    Debug("Reports updated")
end)

RegisterNetEvent("reportmenu:client:addactivereport", function(data)
    if not data then return Debug("[reportmenu:client:addactivereport] data parm is null.") end

    MyReports[data.randomKey] = data

    UIMessage("nui:state:myreports", MyReports)
end)

RegisterNetEvent("staffchat:client:removemyreport", function(data)
    if not data then return Debug("[staffchat:client:removemyreport] data param is null.") end

    if MyReports[data.randomKey] then
        MyReports[data.randomKey] = nil
        UIMessage("nui:state:myreports", MyReports)
        Debug("(reportmenu:client:removemyreport) Report deleted on the client sided `MyReports` table.")
    end
end)
