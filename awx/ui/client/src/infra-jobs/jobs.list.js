/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/


export default ['i18n', function(i18n) {
    return {

        name: 'ipam_infrastructure_jobs',
        iterator: 'job',
        editTitle: i18n._('INFRA JOBS'),
        listTitle: i18n._('INFRA JOBS'),
        search: {
            order_by: 'name'
        },
		searchJob: 1,
        selectInstructions: '<p>Select existing users by clicking each user or checking the related checkbox. When finished, click the blue ' +
            '<em>Select</em> button, located bottom right.</p> <p>When available, a brand new user can be created by clicking the ' +
            '<i class=\"fa fa-plus\"></i> button.</p>',
        index: false,
        hover: true,
        fields: {
            status: {
                label: '',
                iconOnly: true,
                ngClick: 'showJobScript(job.id)',
//                awToolTip: '{{ project.statusTip }}',
				awToolTip: '{{ job.tool_tip }}',
                dataPlacement: 'right',
                icon: "{{ 'icon-job-' + job.job_status }}",
                columnClass: "List-staticColumn--smallStatus",
                nosort: true,
                excludeModal: true
            },
            name: {
                key: true,
                label: i18n._('Name'),
                columnClass: 'col-md-2 col-sm-2 col-xs-8',
                awToolTip: "Redirect to Job Page",
                awTipPlacement: "top",
				ngClick: "infraJobs()",
            },
			id: {
                label: i18n._('Type'),
                ngBind: 'job.opts.id_type',
                columnClass: 'col-md-2 col-sm-2 hidden-xs'
            },
            created: {
            	label: i18n._('Created'),
            	columnClass: 'col-md-2 col-sm-2 hidden-xs'
            },
            last_updated: {
                label: i18n._('Last Updated'),
                filter: "longDate",
                columnClass: "col-lg-3 hidden-md hidden-sm hidden-xs",
                excludeModal: true
            }
        },
/*
        actions: {
            ret: {
            	type: 'button',
				buttonContent: 'Return',
                label: i18n._('Back to Parent'),
                mode: 'all', // One of: edit, select, all
                ngClick: 'BackTo()',
                awToolTip: i18n._('Back to Parent'),
                actionId: 'button-return',
                ngShow: 'canAdd'
            }
        },*/
        fieldActions: {

            columnClass: 'col-md-2 col-sm-3 col-xs-3',
            
            launch: {
                label: i18n._('Launch'),
                icon: 'icon-launch',
               	ngClick: "launchJob(job.id)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Start Asset'),
                dataPlacement: 'top',
            },
		    poweroff: {
                label: i18n._('Launch Poweroff Job Template'),
                iconClass: 'fa fa-power-off',
               	ngClick: "poweroffJob(job.id, job.name)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Stop Asset'),
                dataPlacement: 'top',
            },
			remove: {
                label: i18n._('Launch Remove Job Template'),
                iconClass: 'fa fa-remove',
               	ngClick: "removeJob(job.id, job.name)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Remove Asset'),
                dataPlacement: 'top',
            },
            edit: {
                label: i18n._('Edit'),
                icon: 'icon-edit',
               	ngClick: "editJob(job.id)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Edit Job'),
                dataPlacement: 'top',
            },
			view: {
                ngClick: "viewJob(job.id)",
                awToolTip: i18n._('View the Job'),
                dataPlacement: 'top',
                icon: 'fa-eye',
            },
            schedule: {
                mode: 'all',
                ngClick: "editSchedules(job.id)",
                awToolTip: i18n._('Schedule Job'),
                dataPlacement: 'top',
            },
            copy: {
                label: i18n._('Copy'),
                ngClick: 'duplicateJob(job.id)',
                "class": 'btn-danger btn-xs',
                awToolTip: i18n._('Duplicate Job'),
                dataPlacement: 'top',
            },
			"delete": {
                label: i18n._('Delete'),
                ngClick: "deleteJob(job.id, job.name)",
                icon: 'icon-trash',
                "class": 'btn-xs btn-danger',
                awToolTip: i18n._('Delete Job'),
                dataPlacement: 'top',
            }
        }
    };}];
