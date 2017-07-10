#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection').nuxeoSalesManager;

nuxeo.workflows().fetchTasks({
    workflowModelName: 'BCContractValidationWf'
}).then(tasks => {
    if (tasks.length === 0) {
        console.log('No task to do! Cool!');
        return;
    }

    tasks.entries.forEach(currentTask => {
        console.log(`Name: ${currentTask.name}`);
        console.log(`Status: ${currentTask.state}`);
        console.log(`What to do: ${currentTask.directive}`);
        console.log(`Before: ${currentTask.dueDate}`);
        console.log(`On document id: ${currentTask.targetDocumentIds[0].id}`);
        console.log(`Task form can be downloaded at: ${currentTask.taskInfo.layoutResource.url}`);
        console.log('Possible actions for this task:');

        currentTask.taskInfo.taskActions.forEach(currentAction => console.log(`Name: ${currentAction.name}\nCan be triggered using code or by following this link:\n${currentAction.url}`));

        currentTask.complete('validate')
            .then(completedTask => {
                console.log(`We will validate the contract.\nTask ${completedTask.name} is now ${completedTask.state}.`);
                nuxeo.repository().fetch(completedTask.targetDocumentIds[0].id, { schemas: ['bccontract'] })
                    .then(contract => {
                        console.log(`Contract ${contract.title} is now in the following state: ${contract.state}`);
                        console.log(`Contract's expiration date has been automatically set to one year from now: ${contract.properties['bccontract:expirationDate']}.`);
                    })
                    .catch(error => {
                        console.log('Apologies, an error occurred while completing a task.');
                        console.log(error);
                    })
            }).catch(error => {
                console.log('Apologies, an error occurred while fetching the tasks.');
                console.log(error);
            })
    })
});
