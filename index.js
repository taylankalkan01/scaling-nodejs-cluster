const cluster = require("cluster");
const http = require("http");
const totalCpus = require("os").cpus().length;
const process = require("process");

if (cluster.isPrimary) {
	console.log(`Number of CPUs are ${totalCpus}`);
	console.log(`Primary ${process.pid} is running`);

	// Create worker threads
	for (let i = 0; i < totalCpus; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
		console.log(`Let fork another worker`);
		cluster.fork();
	});
} else {
	// Workers can share any TCP connection
	// In this case it is an HTTP server
	http
		.createServer((req, res) => {
			res.writeHead(200);
			res.end("hello world");
		})
		.listen(8000);

	console.log(`Worker ${process.pid} started`);
}
