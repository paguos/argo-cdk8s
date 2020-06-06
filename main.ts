import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';

import { CronWorkflow} from './imports/argoproj.io/cronworkflow';
import { Workflow} from './imports/argoproj.io/workflow';
import { WorkflowTemplate} from './imports/argoproj.io/workflowtemplate';
import { ClusterWorkflowTemplate} from './imports/argoproj.io/clusterworkflowtemplate';


export class ArgoExampleWorkflows extends Chart {

  workflowSpec =  {
    entrypoint: "whalesay",
    templates: [
        {
          name: "whalesay",
          container: {
              image: "docker/whalesay:latest",
              command: ["cowsay"],
              args: ["'hello world'"]

          }
        }
    ]
};

  constructor(scope: Construct, name: string) {
    super(scope, name);

    // define resources here
    new Workflow(this, "wf", {
      metadata: {
          generateName: "hello-world-"
      },
      spec: this.workflowSpec
    });

    new WorkflowTemplate(this, "wf-template", {
      metadata: {
        name: "hello-world-template"
      },
      spec: this.workflowSpec
    });
    
    new ClusterWorkflowTemplate(this, "cluster-wf-template", {
      metadata: {
        name: "hello-world-template"
      },
      spec: this.workflowSpec
    });

    new CronWorkflow(this, "cron-wf", {
      metadata: {
        name: "hello-world-cronwf",
      },
      spec: {
        schedule: "* * * * *",
        workflowSpec: this.workflowSpec
      }
    });


  }
}

const app = new App();
new ArgoExampleWorkflows(app, 'argo-cdk8s');
app.synth();
