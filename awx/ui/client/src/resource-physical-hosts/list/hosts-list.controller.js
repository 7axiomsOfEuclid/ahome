/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import { N_ } from "../../i18n";

export default ['$scope', '$rootScope', 'Rest', 'HostList', 'Prompt',
    'ProcessErrors', 'GetBasePath', 'Wait', '$state', '$filter',
    'rbacUiControlService', 'Dataset', 'i18n', 
    function($scope, $rootScope, Rest, HostList, Prompt,
    ProcessErrors, GetBasePath, Wait, $state, $filter, rbacUiControlService,
    Dataset, i18n) {

        var list = HostList,
        defaultUrl = GetBasePath('ipam_bare_metals');

        init();

        function init() {

            $scope.canAdd = false;
            
            rbacUiControlService.canAdd('ipam_bare_metals')
                .then(function(params) {
                    $scope.canAdd = params.canAdd;
                });
                
            // search init
            $scope.list = list;
            $scope[`${list.iterator}_dataset`] = Dataset.data;
            $scope[list.name] = $scope[`${list.iterator}_dataset`].results;


            $rootScope.flashMessage = null;
            $scope.selected = [];
        }
        
        $scope.addBareMetal = function() {
            $state.go('resourcePhysicalHostsList.add');
        };

        $scope.editBareMetal = function() {
            $state.go('resourcePhysicalHostsList.edit', { baremetal_id: this.baremetal.id });
        };

        $scope.deleteBareMetal = function(id, name) {
            var action = function() {
                $('#prompt-modal').modal('hide');
                Wait('start');
                var url = defaultUrl + id + '/';
                Rest.setUrl(url);
                Rest.destroy()
                    .then(() => {

                        let reloadListStateParams = null;

                        if($scope.ipam_bare_metals.length === 1 && $state.params.baremetal_search && !_.isEmpty($state.params.baremetal_search.page) && $state.params.baremetal_search.page !== '1') {
                            reloadListStateParams = _.cloneDeep($state.params);
                            reloadListStateParams.baremetal_search.page = (parseInt(reloadListStateParams.baremetal_search.page)-1).toString();
                        }

                        if (parseInt($state.params.baremetal_id) === id) {
                            $state.go('^', null, { reload: true });
                        } else {
                            $state.go('.', null, { reload: true });
                        }
                    })
                    .catch(({data, status}) => {
                        ProcessErrors($scope, data, status, null, {
                            hdr: i18n._('Error!'),
                            msg: i18n.sprintf(i18n._('Call to %s failed. DELETE returned status: '), url) + status
                        });
                    });
            };

            Prompt({
                hdr: i18n._('Delete'),
                resourceName: $filter('sanitize')(name),
                body: '<div class="Prompt-bodyQuery">' + i18n._('Are you sure you want to delete this bare metal?') + '</div>',
                action: action,
                actionText: i18n._('DELETE')
            });
        };
    }
];
