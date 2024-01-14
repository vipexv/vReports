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

RegisterNetEvent("reportmenu:client:cb:leaderboard", function(leaderboardData)
    if not leaderboardData then return Debug("[reportmenu:client:cb:leaderboard] First param is null.") end

    UIMessage("nui:state:leaderboard", leaderboardData)
end)

RegisterNetEvent("reportmenu:client:update", function(activeReports)
    if not activeReports then return Debug("[reportmenu:client:cb:update] First param is null.") end

    UIMessage("nui:state:reports", activeReports)
    Debug("Reports updated")
end)

RegisterNetEvent("reportmenu:client:addactivereport", function(data)
    if not data then return Debug("[reportmenu:client:addactivereport] data parm is null.") end

    MyReports[data.reportId] = data

    UIMessage("nui:state:myreports", MyReports)
end)

RegisterNetEvent("reportmenu:client:updateactivereport", function(report)
    if not report then return Debug("[reportmenu:client:updateactivereport] first param is null.") end

    local reportId = report.reportId

    if MyReports[reportId] then
        Debug("[reportmenu:client:updateactivereport] My Report found.")
        MyReports[reportId] = report
        UIMessage("nui:state:myreports", MyReports)
        ShowNotification({
            title = "Report Menu | Update",
            description = ("Your report with the ID: [%s] has been updated,  Access it by doing /%s"):format(reportId,
                Config.ReportMenuCommand)
        })
    end
end)

RegisterNetEvent("staffchat:client:removemyreport", function(data)
    if not data then return Debug("[staffchat:client:removemyreport] data param is null.") end

    if MyReports[data.reportId] then
        MyReports[data.reportId] = nil
        UIMessage("nui:state:myreports", MyReports)
        Debug("(reportmenu:client:removemyreport) Report deleted on the client sided `MyReports` table.")
    end
end)
