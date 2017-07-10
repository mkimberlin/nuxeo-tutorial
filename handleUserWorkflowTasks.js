#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection').nuxeoSales;

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

        currentTask.taskInfo.taskActions.forEach(currentAction => {
            console.log(`Name: ${currentAction.name}`);
            currentTask.variable('contractAmount', '67890.99').complete('confirm')
                .then(completedTask => {
                    console.log('We will fill in an amound and confirm to send the contract for validation.');
                    console.log(`Task ${completedTask.name} is now ${completedTask.state}.`);

                    nuxeo.repository().fetch(completedTask.targetDocumentIds[0].id, {schemas: ['bcsalescommon']})
                        .then(contract => {
                            console.log(`Contract ${contract.title} is now in the following state: ${contract.state}.`);
                            console.log(`Its amount has been set to ${contract.properties['bcsalescommon:amount']}.`);
                        });
                }).catch(error => {
                    console.log('Apologies, an error occurred while completing a task.');
                    console.log(error);
                });
        });
    });
}).catch(error => {
   console.log('Apologies, an error occurred while fetching the tasks.');
   console.log(error);
});