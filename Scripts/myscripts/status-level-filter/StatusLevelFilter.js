/**
 * Reusable status filter
 * Jai
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
        if (this.allowed_movement == null) {
            this.allowed_movement = [];
            this.approval_levels.forEach((ap) => {
                this.allowed_movement.push({ id: ap.id, backlevel: 1, movelevel: 1, })
            })
        }
        for (var i = 0; i < this.approval_levels.length; i++) {
            var ap = this.approval_levels[i]
            if (ap.display == null) { ap.display = 1; }
            if (ap.iscancelled == null) { ap.iscancelled = false; }
            if (ap.display != 0) {
                l1.push(`<button type="button" class="${ap.btnclass}" data-filter="${ap.id}">${ap.status} <span class="${ap.badgeclass}">0</span></button>`)
            }
            var ex = this.allowed_movement.find((x) => x.id == ap.id);
            if (ex == null) { this.allowed_movement.push({ id: ap.id, backlevel: 0, movelevel: 0, }) }
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
        $(parent).prop('class', 'js-level-update')
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
            var dontshowcancel = 0;
            if (l1.length > 0) {

                if (l1.length == 2) {
                    // back to                  
                    if (this.IsBackButtonAllowed(l1[0])) {
                        l2.push(`
                            <button type="button" class="${l1[0].backclass}" data-filter="backlevel" data-value="${l1[0].id}" data-title="${l1[0].name}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="Return back to ${l1[0].name}...">
                            <span class="fas fa-arrow-circle-left"></span> Return to ${l1[0].name}</button>
                        `)
                    }

                    // move to
                    if (this.IsMoveButtonAllowed(l1[1])) {
                        l2.push(`
                        <button type="button" class="${l1[1].moveclass}" data-filter="movelevel" data-value="${l1[1].id}" data-title="${l1[1].name}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="Update status to ${l1[1].name}...">
                        <span class="fas fa-arrow-circle-right"></span> ${l1[1].name}</button>
                    `)
                    }

                    // dont show cancel button
                    dontshowcancel = (l1[1].dontshowcancel != null && l1[1].dontshowcancel == 1)

                } else {

                    var ap = l1[0]

                    // if last
                    if (index > 0 || (index == this.approval_levels.length)) {
                        // back to first
                        if (this.IsBackButtonAllowed(ap)) {
                            l2.push(`
                                <button type="button" class="${ap.backclass}" data-filter="backlevel" data-value="${ap.id}" data-title="${ap.name}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="Return back to ${ap.name}">
                                <span class="fas fa-arrow-circle-left"></span> Return to ${ap.name}</button>
                            `)
                        }


                    } else {
                        // move to
                        if (this.IsMoveButtonAllowed(ap)) {
                            l2.push(`
                            <button type="button" class="${ap.moveclass}" data-filter="movelevel" data-value="${ap.id}" data-title="${ap.name}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="Update status to ${ap.name}">
                            <span class="fas fa-arrow-circle-right"></span> ${ap.name}</button>
                        `)
                        }

                    }

                    // dont show cancel button
                    dontshowcancel = (ap.dontshowcancel != null && ap.dontshowcancel == 1)
                }

                // find iscancelled button (separate it)
                var l3 = [];
                if (index + 1 != this.approval_levels.length && dontshowcancel == 0) {
                    var cx = this.approval_levels.filter((x) => x.iscancelled == true)[0];
                    if (cx != null) {
                        // move to
                        l3.push(`
                        <button type="button" class="${cx.moveclass}" data-filter="movelevel" data-value="${cx.id}" data-title="${cx.name}" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="Update status to ${cx.name}...">
                        <span class="fas fa-trash-alt"></span> ${cx.name}</button>
                    `)
                    }
                }

                // append html
                $(parent).html(`
                            <div class="btn-group btn-group-sm">
                                ${l2.filter(Boolean).join("")}
                            </div>
                            <div class="btn-group btn-group-sm">
                                ${l3.filter(Boolean).join("")}
                            </div>
                        `)

                $(parent).find('button[data-filter]').on('click', (e) => {
                    this.onMoveToLevelButtonClicked_Handler(e.currentTarget)
                });

            }

        }

    }

    /**
     * check if back button is allowed
     * @param {any} e
     * @returns
     */
    IsBackButtonAllowed(e) {
        if (this.allowed_movement == null) {
            return true;
        }
        var exists = this.allowed_movement.find((x) => x.id == e.id)
        return (exists != null && exists.backlevel == 1)
    }

    /**
     * check if move button is allowed
     * @param {any} e
     * @returns
     */
    IsMoveButtonAllowed(e) {
        if (this.allowed_movement == null) {
            return true;
        }
        var exists = this.allowed_movement.find((x) => x.id == e.id)
        return (exists != null && exists.movelevel == 1)
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
