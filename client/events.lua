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
