RegisterNetEvent("UIMessage", function(action, data)
    UIMessage(action, data)

    Debug("(netEvent) [UIMessage] \n (param) action: ", json.encode(action), "\n (param) data: ", json.encode(data),
        "\n Invoking Resource: ",
        GetInvokingResource())
end)

RegisterNetEvent("staffchat:state:playerdata", function(data)
    PlayerData = data

    Debug("[event:staffchat:state:playerdata] data param: ", json.encode(data))
end)
