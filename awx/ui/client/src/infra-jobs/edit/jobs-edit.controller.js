/*************************************************
 * Copyright (c) 2016 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

import { N_ } from "../../i18n";

export default ['$window', '$scope', '$rootScope', '$stateParams', '$timeout', 'JobForm', 'GenerateForm', 'Rest','ParseTypeChange',
    'Alert', 'ProcessErrors', 'ReturnToCaller', 'GetBasePath', 'MultiCredentialService',
    'Wait', 'CreateSelect2', '$state', '$location', 'i18n','ParseVariableString', 'initSelect',
    function($window, $scope, $rootScope, $stateParams, $timeout, JobForm, GenerateForm, Rest, ParseTypeChange, Alert,
    ProcessErrors, ReturnToCaller, GetBasePath, MultiCredentialService, Wait, CreateSelect2,
	$state, $location, i18n,ParseVariableString, initSelect) {

        var master = {}, boxes, box, variable, 
            id = $stateParams.job_id,
        	fk_model = $window.localStorage.getItem('fk_model'),
        	fk_type =  $window.localStorage.getItem('fk_type'),
        	fk_id =  $window.localStorage.getItem('fk_id'),
        	id_type = $window.localStorage.getItem('form_id'),
            form = JobForm[id_type],
            defaultUrl = GetBasePath('ipam_infrastructure_jobs') + id;
        var project_id, template_id, poweroff_id, remove_id,
			template_data = {}, poweroff_data = {}, remove_data = {};
        console.log($stateParams);
        console.log(JobForm);
        console.log(form);
        init();

        function init() {
        	//$scope.canAdd = false;
            Rest.setUrl(defaultUrl);
            Wait('start');
            Rest.get(defaultUrl).then(({data}) => {
				var itm;
                $scope.job_id = id;
                project_id = data.opts.project_id;
                template_id = data.opts.template_id;
                poweroff_id = data.opts.poweroff_id;
                remove_id = data.opts.remove_id;
                
                Rest.setUrl(GetBasePath('job_templates') + template_id + '/');
            	Rest.get(defaultUrl).then(({data}) => {
            		template_data = data;
            	});
            	Rest.setUrl(GetBasePath('job_templates') + poweroff_id + '/');
            	Rest.get(defaultUrl).then(({data}) => {
            		poweroff_data = data;
            	});
        	    Rest.setUrl(GetBasePath('job_templates') + remove_id + '/');
            	Rest.get(defaultUrl).then(({data}) => {
            		remove_data = data;
            	});
		        $scope.tabId = 1;
                $scope.status1 = "active";
                for (itm in data.opts)
                {
                	$scope[itm] = data.opts[itm];
                	if(data.opts[itm] === 'true')
                	{
                		$scope[itm] = true;
                	}
                	else if(data.opts[itm] === 'false')
                	{
                		$scope[itm] = false;
                	}
                }
                id_type = data.opts.id_type;
                console.log("ID_TYPE " + id_type);

				//setScopeFields(data);
				//Set YAML/JSON Oots
				var callback = function() {
		            // Make sure the form controller knows there was a change
		            $scope[form.name + '_form'].$setDirty();
		        };

			    for(var field in form.fields)
				{
					console.log(field);
					if(form.fields[field].type == 'select')
					{
						if(form.fields[field].ngValues)
						{
							$scope[field + '_type_options'] = initSelect('', form.fields[field].ngValues, form.fields[field].ngFilter ? form.fields[field].ngFilter : "");
						}
						else
						{
							if(form.fields[field].ngSource)
								$scope[field + '_type_options'] = initSelect(form.fields[field].ngSource, '', form.fields[field].ngFilter ? form.fields[field].ngFilter : "");
						}
						var elmnt = '#' + id_type + '_' + field;
						CreateSelect2({
				            element: elmnt,
				            multiple: false,
				        });
					}
					if(form.fields[field].type == 'toggleSwitch')
					{
						if(form.fields[field].default != undefined) $scope[field] = form.fields[field].default;
					}
				}
	        	//Set Default Value 2018/12/13
		        $timeout(function(){
		        	for(var field in form.fields)
					{
						if(form.fields[field].type == 'select')
						{
							for(var fld in $scope[field + '_type_options'])
							{
								if(form.fields[field].opt)
								{
									if($scope[field + '_type_options'][fld].label == data.opts[field])
									$scope[field] = $scope[field + '_type_options'][fld];
					            }
					            else
					            {
					            	if($scope[field + '_type_options'][fld].value == data.opts[field])
									$scope[field] = $scope[field + '_type_options'][fld];
					            }
							}
						}
					}
				},2000);
				//for multi credential 2018/10/25
				MultiCredentialService.getCredentialTypes()
	            .then(({ data }) => {
	                $scope.multiCredential = {
	                    credentialTypes: data.results,
	                    selectedCredentials: []
	                };
	            });
	            
        		/*const multiCredential = {};
                const credentialTypesPromise = MultiCredentialService.getCredentialTypes()
                    .then(({ data }) => {
                        multiCredential.credentialTypes = data.results;
                    });
                console.log(credentialTypesPromise);
                const multiCredentialPromises = [credentialTypesPromise];

                $scope.canGetAllRelatedResources = false;
                multiCredential.selectedCredentials = _.get(jobTemplateData, 'summary_fields.credentials');
				
				console.log(multiCredential);
                $q.all(multiCredentialPromises)
                    .then(() => {
                        $scope.multiCredential = multiCredential;
                        //$scope.$emit('jobTemplateLoaded', master);
                    });*/
            })
            .catch(({data, status}) => {
                ProcessErrors($scope, data, status, null, {
                    hdr: i18n._('Error!'),
                    msg: i18n.sprintf(i18n._('Failed to retrieve Job: %s. GET status: '), $stateParams.id) + status
                });
            });
            // change to modal dialog
            var element = document.getElementById("modaldlg");
            element.style.display = "block";
            var panel = element.getElementsByClassName("Panel ng-scope");
            panel[0].classList.add("modal-dialog");
            panel[0].style.width = "60%";
            Wait('stop');
        }
        $scope.toggleForm = function(key) {
            $scope[key] = !$scope[key];
        };
		var callback = function() {
            // Make sure the form controller knows there was a change
            $scope[form.name + '_form'].$setDirty();
        };
		function getVars(str){
            // Quick function to test if the host vars are a json-object-string,
            // by testing if they can be converted to a JSON object w/o error.
            function IsJsonString(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }

            if(str === ''){
                return '---';
            }
            else if(IsJsonString(str)){
                str = JSON.parse(str);
                return jsyaml.safeDump(str);
            }
            else if(!IsJsonString(str)){
                return str;
            }
        }
        
		$scope.WizardClick = function (clickID) {
			if (clickID == 1) {
				if($scope.tabId > 1)
					$scope.tabId = $scope.tabId - 1;
			}
			else if (clickID == 2) {
				 
				if($scope.tabId < 3)
				{
					$scope.tabId = $scope.tabId + 1;
				}
				if($scope.tabId == 2)
				{

					//$scope.opts = getVars(data);
				}
				if($scope.tabId == 3)
				{
					var fld;
					var data = "{\n";
					console.log(form);
					for (fld in form.fields) {
						
						if(form.fields[fld].type == 'select')
						{
							data += "'" + fld + "':";
							if(form.fields[fld].opt)
							{
								if($scope[fld] != undefined) data += "'" + $scope[fld].label + "'";
			            		else data += "''";
				            }
				            else
				            {
				            	if($scope[fld] != undefined) data += "'" + $scope[fld].value + "'";
				            	else data += "''";
				            }
			            	data += ",\n"; 
			            	continue;
						}
						if(form.fields[fld].type == 'sensitive')
						{
							data += "'" + fld + "':'$Encrypted$',\n";
			            	continue;
						}
                        if (fld == "multiCredential") {
                            var mcredentials = [];
                            data += "'" + fld + "':";
                            if ($scope[fld]['selectedCredentials'] != undefined) {
                                data += "'"
                                for (subid in $scope[fld]['selectedCredentials']) {
                                    var cred = {};
                                    console.log($scope[fld]['selectedCredentials'][subid]);
                                    cred.id = $scope[fld]['selectedCredentials'][subid].id;
                                    data += $scope[fld]['selectedCredentials'][subid].id + ',';
                                    mcredentials.push(cred);
                                }
                                data += "',";
                            }
                            else data += "'',";
                            data += "\n";
                            console.log(mcredentials);
                            continue;
                        }
						if(form.fields[fld].type == 'custom')
						{
							data += "'" + fld + "':";
							if($scope[fld] != undefined)
							{
								console.log($scope[fld]);
								data += "'";
								if($scope[fld] != '' && $scope[fld] != undefined)
								{
									for(var subid in $scope[fld]){
										if(subid.startsWith('selected'))
										{
											for(var selectedCustom in $scope[fld][subid]){
												data += $scope[fld][subid][selectedCustom].id + ',';
											}
										}
									}
									data = data.substring(0, data.length-1);
								}
								data += "',"; 
							}
							else data += "'',";
							data+= "\n";
							continue;
						}
		            	if(fld != "opts")
		            	{
			            	data += "'" + fld + "':";
			            	if($scope[fld] != undefined) data += "'" + $scope[fld] + "'";
			            	else data += "''";
			            	data += ",\n"; 
			            }
		            }
		            data += "'fk_model':'" + fk_model + "',\n";
		            data += "'fk_type':'" + fk_type + "',\n";
		            data += "'fk_id':'" + fk_id + "',\n";
		            data += "'id_type':'" + id_type + "',\n";
		            data += "'scm_type':'',\n";
		            data += "'project_id':'" + project_id + "',\n";
		            data += "'template_id':'" + template_id + "',\n";
					data += "'poweroff_id':'" + poweroff_id + "',\n";
		            data += "'remove_id':'" + remove_id + "'\n";
		        	data += "}";
		        	console.log(data);
		            $scope.opts = ParseVariableString(data);
					$scope.parseTypeOpts = 'yaml';
			        ParseTypeChange({
			            scope: $scope,
			            field_id: id_type + '_opts',
			            variable: 'opts',
			            onChange: callback,
			            parse_variable: 'parseTypeOpts'
			        });
				}
			}

			if ($scope.tabId == 1) {
				$scope.status1 = "active";
				$scope.status2 = "";
				$scope.status3 = "";
			}
			else if ($scope.tabId == 2) {
				$scope.status1 = "complete";
				$scope.status2 = "active";
				$scope.status3 = "";
			}
			else if ($scope.tabId == 3) {
				$scope.status1 = "complete";
				$scope.status2 = "complete";
				$scope.status3 = "active";
			}
		};

		function setScopeFields(data) {
            _(data)
                .pick(function(value, key) {
                    return form.fields.hasOwnProperty(key) === true;
                })
                .forEach(function(value, key) {
                    $scope[key] = value;
                })
                .value();
            return;
        }

        // prepares a data payload for a PUT request to the API
        var processNewData = function(fields) {
            var data = {};
            _.forEach(fields, function(value, key) {
                if ($scope[key] !== '' && $scope[key] !== null && $scope[key] !== undefined) {
                    data[key] = $scope[key];
                }
            });
            if($scope.datacenter != null) data.datacenter = $scope.datacenter.value;
            if($scope.credential != null) data.credential = $scope.credential.value;
    		data.opts = $scope.opts;
    		
            return data;
        };

        $scope.formCancel = function() {
            $state.go('infraJobsList', null, { reload: true}, null, { reload: true });
        };

        $scope.formSave = function() {
        	console.log("Update");
			var fld, base, data = {}, data_project = {}, data_job = {};
			Wait('start');
			//Project Saving
    		data_project.name = 'Configure_' + $scope.name;
            Rest.setUrl(GetBasePath('projects') + project_id + '/');
            Rest.put(data_project)
            	.then(({data}) => {
						//****************************************************************************/
						//Job Saving
		    			template_data.name = form.configure_job.name_prefix + $scope.name;
						Rest.setUrl(GetBasePath('job_templates') + template_id + '/');
			            Rest.put(template_data)
			            .then(({data}) => {
			                	console.log('Related Job Template changed succeed');
			                	
			                	//****************************************************************************/
			                	//Job Saving
		    					poweroff_data.name = form.poweroff_job.name_prefix + $scope.name;
								Rest.setUrl(GetBasePath('job_templates') + poweroff_id + '/');
					            Rest.put(poweroff_data)
					            .then(({data}) => {
					                	console.log('Related Job Template changed succeed');
					                	//****************************************************************************/
					                	//Job Saving
		    							remove_data.name = form.remove_job.name_prefix + $scope.name;
										Rest.setUrl(GetBasePath('job_templates') + remove_id + '/');
							            Rest.put(remove_data)
							            .then(({data}) => {
							                	console.log('Related Job Template changed succeed');
							                	//Save Job (Sub Items)
									            Rest.setUrl(defaultUrl + '/');
									            var data_subitem = processNewData(form.fields);
									            console.log($scope);
									            console.log($scope.name);
									            console.log(data_subitem);
									            
									            Rest.put(data_subitem)
									                .then(({data}) => {
									                    base = $location.path().replace(/^\//, '').split('/')[0];
									                    console.log(base);
									                    if (base === 'ipam_infrastructure_jobs') {
									                        $rootScope.flashMessage = i18n._('New Job successfully created!');
									                        $rootScope.$broadcast("EditIndicatorChange", "Job", data.id);
									                        
									                        $state.go('infraJobsList', null, { reload: true});
									                    } else {
									                        ReturnToCaller(1);
									                    }
									                    console.log('InfraJob Post succeed');
									                })
									                .catch(({data, status}) => {
									                    ProcessErrors($scope, data, status, form, { hdr: i18n._('Error!'), msg: i18n._('Failed to add new JOB_SUBITEM. POST returned status: ') + status });
									                });
									    })
						                .catch(({data, status}) => {
						                    Wait('stop');
						                    ProcessErrors($scope, data, status, form, { hdr: i18n._('Error!'),
						                        msg: i18n._('Failed to create new REMOVE JOB TEMPLATE. POST returned status: ') + status });
						                });
									})
				                .catch(({data, status}) => {
				                    Wait('stop');
				                    ProcessErrors($scope, data, status, form, { hdr: i18n._('Error!'),
				                        msg: i18n._('Failed to create new POWER OFF JOB TEMPLATE. POST returned status: ') + status });
				                });	                

			                })
			                .catch(({data, status}) => {
			                    Wait('stop');
			                    ProcessErrors($scope, data, status, form, { hdr: i18n._('Error!'),
			                        msg: i18n._('Failed to create new CONFIGURE JOB TEMPLATE. POST returned status: ') + status });
			                });
                })
                .catch(({data, status}) => {
                	Wait('stop');
		            ProcessErrors($scope, data, status, form, { hdr: i18n._('Error!'),
		            	msg: i18n._('Failed to create new PROJECT. POST returned status: ') + status });
                });
        };
    }
];
