/*************************************************
 * Copyright (c) 2015 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/


export default ['i18n', function(i18n) {
    return {

        name: 'ipam_bare_metals',
        iterator: 'baremetal',
        editTitle: i18n._('IPAM BARE METALS'),
        listTitle: i18n._('IPAM BARE METALS'),
        search: {
            order_by: 'name'
        },
        selectInstructions: '<p>Select existing users by clicking each user or checking the related checkbox. When finished, click the blue ' +
            '<em>Select</em> button, located bottom right.</p> <p>When available, a brand new user can be created by clicking the ' +
            '<i class=\"fa fa-plus\"></i> button.</p>',
        index: false,
        hover: true,

        fields: {
            name: {
                key: true,
                label: i18n._('Name'),
                columnClass: 'col-md-3 col-sm-3 col-xs-9'
            },
		    fqdn: {
                label: i18n._('FQDN'),
                columnClass: 'col-md-3 col-sm-3 hidden-xs'
            },
			datacenter: {
                label: i18n._('Datacenter'),
                ngBind: 'baremetal.summary_fields.datacenter.name',
                sourceModel: 'datacenter',
                sourceField: 'name',
                excludeModal: true,
                columnClass: 'col-md-3 col-sm-3 hidden-xs'
            },
		    primary_ip: {
                label: i18n._('Primary IPv4'),
                columnClass: 'col-md-3 col-sm-3 hidden-xs'
            },
	        primary_mac: {
                label: i18n._('MAC'),
                columnClass: 'col-md-3 col-sm-3 hidden-xs'
            }
        },

        actions: {
            add: {
                label: i18n._('Create New'),
                mode: 'all', // One of: edit, select, all
                ngClick: 'addBareMetal()',
                awToolTip: i18n._('Create a new bare metal'),
                actionClass: 'at-Button--add',
                actionId: 'button-add',
                ngShow: 'canAdd'
            }
        },

        fieldActions: {

            columnClass: 'col-md-2 col-sm-3 col-xs-3',

            edit: {
                label: i18n._('Edit'),
                icon: 'icon-edit',
               	ngClick: "editBareMetal(baremetal.id)",
                "class": 'btn-xs btn-default',
                awToolTip: i18n._('Edit bare metal'),
                dataPlacement: 'top',
            },

            "delete": {
                label: i18n._('Delete'),
                ngClick: "deleteBareMetal(baremetal.id, baremetal.name)",
                icon: 'icon-trash',
                "class": 'btn-xs btn-danger',
                awToolTip: i18n._('Delete bare metal'),
                dataPlacement: 'top',
            }
        }
    };}];
