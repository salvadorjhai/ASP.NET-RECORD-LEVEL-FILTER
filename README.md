

# ASP.NET MVC RECORD LEVEL FILTER

practice project for reusable class and scripts

> approval level, status update, whatever yaya.

status update from Prepared/Pending/Draft to Checked, Endorsed, Approved, etc.

sample screenshot;

![Listing Page](https://raw.githubusercontent.com/salvadorjhai/ASP.NET-RECORD-LEVEL-FILTER/refs/heads/master/_DOCS/list.png)

![Detail Page](https://raw.githubusercontent.com/salvadorjhai/ASP.NET-RECORD-LEVEL-FILTER/refs/heads/master/_DOCS/detail.png)

Filter/Tab Button (Draft, Checked, Approved, etc)

    <div class="row mb-2" id="js-level-filter" style="display:none"></div>

Status Update Button (Back Level / Move To Level)

    <div class="btn-group" id="js-level-update" style="display:none"></div>

Dynamic Approval Level;

        var statuslevelfilter = new StatusLevelFilter({
            parent_filter: $('#js-level-filter'),
            parent_statusbutton: $('#js-level-update'),
            // function to call after filter
            onLevelFilterClicked_Handler: reloadProductTable,
            // function to click on status update
            onMoveToLevelButtonClicked_Handler: onMoveToLevelButtonClicked, 
            // default level id
            default_level: 1,
            // approval level
            approval_levels: [
                {
                    id: 1,
                    status: "Prepared",
                    name: "Prepare",
                    btnclass: `btn btn-outline-primary`,
                    badgeclass: `badge bg-primary`,
                    backclass: `btn btn-danger`,
                    moveclass: `btn btn-success`,
                }, ...

After above setup, you only need to call;

        // initialize
        statuslevelfilter.Initialize()

Still need more cleanup and changes to do.