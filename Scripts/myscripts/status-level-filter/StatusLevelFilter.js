/**
 * Reusable status filter
 */

class StatusLevelFilter {
    constructor(opt) {
        this.parent_filter = opt.parent_filter
        this.parent_statusbutton = opt.parent_statusbutton
        this.default_level = opt.default_level
        this.approval_levels = opt.approval_levels
        this.onLevelFilterClicked_Handler = opt.onLevelFilterClicked_Handler
        this.onMoveToLevelButtonClicked_Handler = opt.onMoveToLevelButtonClicked_Handler
    }

    /**
     * initialize all controls
     */
    Initialize() {
        var parent = this.parent_filter;
        $(parent).empty()

        // get permissions
        var l1 = [];
        for (var i = 0; i < this.approval_levels.length; i++) {
            var ap = this.approval_levels[i]
            l1.push(`<button type="button" class="${ap.btnclass}" data-filter="${ap.id}">${ap.status} <span class="${ap.badgeclass}">0</span></button>`)
        }

        // build
        if (l1.length > 0) {
            // append html
            $(parent).html(`
                    <div class="col-12">
                        <div class="btn-group" role="group" aria-label="status level filter">
                            ${l1.filter(Boolean).join("")}
                        </div>
                    </div>
                    `)
            // display
            $(parent)[0].hidden = false;
            $(parent)[0].style = null;
            // event
            $(parent).find('button[data-filter]').on('click', (e) => {
                this.onLevelFilterClicked(e.currentTarget.dataset.filter)
            });
            // click initial
            this.onLevelFilterClicked(this.default_level)
        }
    }

    /**
     * build move to buttons
     * @param {any} statuslvl <= 0 to clear
     * @returns
     */
    BuildMoveToButtons(statuslvl) {
        var parent = this.parent_statusbutton;
        $(parent).empty()
        if (statuslvl <= 0) {
            $(parent)[0].hidden = true;
            $(parent)[0].style = 'display:none';
            return;
        }
        $(parent)[0].hidden = false;
        $(parent)[0].style = null;

        if (this.approval_levels.length > 0) {
            var l1 = []
            var index = this.approval_levels.findIndex(level => level.id === statuslvl)

            if (index + 1 == this.approval_levels.length) {
                l1.push(this.approval_levels[0]) // was last

            } else if (index > 0) {
                l1.push(this.approval_levels[index - 1]) // previous
            }

            if (index !== -1 && index < this.approval_levels.length - 1) {
                const nextElement = this.approval_levels[index + 1];
                // ignore iscancelled
                if (nextElement.iscancelled == null || nextElement.iscancelled == false) {
                    l1.push(nextElement)
                }
            }

            var l2 = []
            if (l1.length > 0) {

                if (l1.length == 2) {
                    // back to
                    l2.push(`
                        <button type="button" class="${l1[0].backclass}" data-filter="backlevel" data-value="${l1[0].id}" data-title="${l1[0].name}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="Move back to ${l1[0].name}...">
                        <span class="fas fa-arrow-circle-left"></span> Back to ${l1[0].name}</button>
                    `)

                    // move to
                    l2.push(`
                        <button type="button" class="${l1[1].moveclass}" data-filter="movelevel" data-value="${l1[1].id}" data-title="${l1[1].name}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="Update status to ${l1[1].name}...">
                        <span class="fas fa-arrow-circle-right"></span> ${l1[1].name}</button>
                    `)

                } else {

                    var ap = l1[0]

                    // if last
                    if (index > 0 || (index == this.approval_levels.length)) {
                        // back to first
                        l2.push(`
                            <button type="button" class="${ap.backclass}" data-filter="backlevel" data-value="${ap.id}" data-title="${ap.name}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="Move Back to ${ap.name}">
                            <span class="fas fa-arrow-circle-left"></span> Back to ${ap.name}</button>
                        `)

                    } else {
                        // move to
                        l2.push(`
                            <button type="button" class="${ap.moveclass}" data-filter="movelevel" data-value="${ap.id}" data-title="${ap.name}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="Update status to ${ap.name}">
                            <span class="fas fa-arrow-circle-right"></span> ${ap.name}</button>
                        `)

                    }
                }

                // find iscancelled button (separate it)
                if (index + 1 != this.approval_levels.length) {
                    var cx = this.approval_levels.filter((x) => x.iscancelled == true)[0];
                    if (cx != null) {
                        // move to
                        l2.push(`
                        <button type="button" class="${cx.moveclass}" data-filter="movelevel" data-value="${cx.id}" data-title="${cx.name}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="Update status to ${cx.name}...">
                        <span class="fas fa-trash-alt"></span> ${cx.name}</button>
                    `)
                    }
                }

                // append html
                $(parent).html(`
                            ${l2.filter(Boolean).join("")}
                        `)

                $(parent).find('button[data-filter]').on('click', (e) => {
                    this.onMoveToLevelButtonClicked_Handler(e.currentTarget)
                });

            }

        }

    }

    /**
     * update badge count
     * @param {any} js
     */
    updateBadgeCount(js) {
        var parent = this.parent_filter;
        // clear all first
        $(parent).find(`button[data-filter] span`).each((i, e) => {
            $(e).text(0)
        })
        // set actual values
        js.forEach((e) => {
            var o = $(parent).find(`button[data-filter=${e.id}] span`)
            if (o != null) {
                o.text(e.count)
            }
        })
    }


    onLevelFilterClicked(level) {
        this.active_filter = level
        this.setActiveLevelFilterOn(this.active_filter)
        // reload datatable
        this.onLevelFilterClicked_Handler()
    }

    setActiveLevelFilterOn(level) {
        var parent = this.parent_filter;

        // clear selection
        $(parent).find('button[data-filter]').each((i, e) => {
            $(e).removeClass('active')
        })
        // highlight
        $(parent).find(`button[data-filter=${level}]`).addClass('active')
    }


}
