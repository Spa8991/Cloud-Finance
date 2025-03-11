# Cloud-Finance
AWS Serverless project 
**FinanceAPP overview**:
Finance APP is a serverless service to manage a stock portfolio, it allows the user,
thanks to a js backend, to interact and so edit his portfolio. Once the user start the
service has to register or log in into his account to be able to make actions. So once
the user is successfully logged in he can edit his wallet and so: add a stock by giving
its ticker code, visualize all the stocks that have been added to the wallet and finally
remove stocks.

**Architecture** :
This section introduces the design solution for the case study, starting with a description
of the serverless backend application. The focus is on outlining the application’s
architecture, emphasizing its essential components and functionalities. Additionally,
the section provides insights into the AWS services are utilized throughout the different
stages of the application release process.

**Architecture Diagram** :
Finance APP represents a completely serverless backend application which incorporates
an API enabling HTTP clients to carry out operations such as add stock, fetching,
and deletion from a database. The API’s primary access point is developed using
Amazon API Gateway, supported by three AWS Lambda functions, with an Amazon
DynamoDB table as the storage solution. The frontend of the application is developed
using AWS Amplify, and user authentication is managed by Amazon Cognito. Upon
receiving a request, API Gateway routes it to the appropriate Lambda function, which
interacts with DynamoDB and returns a response to API Gateway. Lastly, API
Gateway responds (JSON) to the consumer of the Finance APP service. Figure 1
shows this scenario and API endpoints.

The above architecture takes advantage of different AWS technologies:
• Amazon API Gateway: Routes the clients’ requests to the appropriate Lambda
function;
• Amazon Cognito: Authentication is achieved using AWS Cognito, so the user
is able to register and verify the email, then its possible to log-in. Every user
add and remove stocks form they wallet related to his account;
• AWS Amplify: The application interface was developed based on Javascript
and CSS, to give to the user the access to the different resources and show the
results;
• Amazon DynamoDB: Stores and retrieves stocks data;
• Amazon CloudWatch: Monitor logs files; collects and track metrics;
• AWS Lambda: Handles tasks like creation, reading and deleting of books;
• CodeCommit: We used CodeCommit to save and update the code of the app
and give access to Amplify.

**API** :
According to microservices architecture, Front-end and Back-end are designed to be
separate and highly maintainable, allowing flexible management of the application’s
components. Here’s how this communication takes place with the specific API calls:
POST Calls for User Login: When a user attempts to log in, the frontend
sends a POST request with Username and Password to the login microservice (AWS
Cognito) within the backend. The login microservice processes the request, verifying
user credentials, and returns a response to the frontend, either granting access or
denying it. This division of responsibility allows for the secure management of user
authentication;
POST Calls for User Registration: For new user registrations, the frontend
sends a POST request with Username, Email and Password to the registration microservice
in the backend. The registration microservice handles user data validation and account
creation, responding to the frontend with a registration confirmation. Separating
registration functionality enhances maintainability and scalability;
POST Calls for add stock: When a user enters the name of a stock ticker in
the text box and clicks the submit button, the frontend initiates a POST request with
the details to the stock management microservice in the backend. The microservice
receives the request, updates the database, and sends a response back to the frontend,
confirming the addition of the stock. This separation ensures efficient handling of
stock addition operations.
GET calls to see the stocks of a user wallet: The frontend, a standalone
service, sends GET requests to the dedicated backend microservice responsible for
catching the DynamoDB. The backend processes these GET requests, retrieves the
requested stocks, and returns them to the frontend. This enables users to view all the
stocks available in his own wallet;
DELETE Calls to delate a stock: If the user is in his private wallet page,
and he has some stocks in it, each stock has a delete button, if the user press it
the fronted will send a DELETE request to the dedicated backend microservice with
all the related information as: StockID and owner (UserID). The backend processes
the DELETE request and deletes the stock. In the end, the user will see a message
alert that will tell that the stock has been successfully deleted and the browse will
automatically refresh the page to display the edits.

**Test** :
After developing the whole infrastructure, we moved on to test it. In particular, we
did a stress test to verify that the system would resist despite the high workload by
scaling. To do this we have used:
• k6 : It is an open-source tool for load and stress testing applications. It is
designed to be easy to use and scalable, allowing developers to simulate a large
number of users interacting with an application to verify its performance under
load;
• cloudwatch : Amazon CloudWatch is a monitoring service for resources and
applications on Amazon Web Services (AWS). It allows you to collect and track
metrics, create alarms, and visualize real-time data to optimize resource usage
and improve application performance.
So we passed to create k6 script for testing. We used k6 for run testing and cloudwatch
to check the cloud metrics generated by the tests. We have tested the lambda, and
because of this the main cloud metrics are:
• Invocations : The number of times that the function was invoked;
• Duration : The avg, min, and max amount of time your function code spends
processing an event;
• Error count and success rate (%);
• Concurrent executions : The number of function instances that are processing
events. So essentially, when we have at least 2 instances, the lambda function is
scaling horizontally;
• Throttling: This happens when the workload is so high that neither scaling is
enough and some requests are lost. When we have concurrent execution and no
throttling, the system scales horizontally properly.
So as we said, all the following metrics are cloud side (AWS Cloudwatch).
AS you can see in the Figure 2, during the GET testing we got an issue: after
5 tests the 6th failed after a few invocation becuase of the authToken expired. To
overcome we had to calculate the required metrics by ourself (you can find all the
related data in the zip):
Invocations: min: 1, max: 1,803, avg: 1,064, sum:78,800;
Durations AVG: min: 56.82, max: 116.91, avg: 73.278;
Durations MAX: min: 56.82, max: 3,034, avg: 694.72;
Durations MIN: min: 11.28, max: 56.82, avg: 26.463;
Concurrent excecutions : min:1, max:9, avg: 5.4521

**Conclusions** :
In this file, we have explained how our system works. The system also resists the tests
we have done and it is robust to this because of the AWS infrastructure, which is a
high availability and scalability framework. In fact with the test above we show that
when the number of requests is high, the lambda functions scales horizontally properly.
Avalability is guaranteed, because of AWS SLA (Service Level Agreement) of
• 99.95% of Lambda and API Gateway;
• 99.99% of Cognito, DynamoDB and Amplify. so the goal of the test is achieved.
