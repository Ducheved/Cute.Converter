module.exports = {
    incrementTotalRequests: function (metrics) {
        metrics.client.inc('total_requests');
    },

    incrementSuccessfulResponses: function (metrics) {
        metrics.client.inc('successful_responses');
    },

    incrementErrorResponses: function (metrics) {
        metrics.client.inc('error_responses');
    },

    handleRequest: function (metrics) {
        return (request, reply, done) => {
            this.incrementTotalRequests(metrics);
            done();
        };
    },
    handleImageProcessingMetrics: function (metrics, request, startTime, input, output, result) {
        if (result) {
            request.metrics = {
                processingTime: Date.now() - startTime,
                inputSize: input.size,
                outputSize: output.size
            };
        } else {
            // Обработка случая, когда result или result.optimization не определены
            console.error('result or result.optimization is undefined');
        }
    },
    handleResponse: function (metrics) {
        return (request, reply, payload, done) => {
            if (reply.statusCode >= 200 && reply.statusCode < 300) {
                this.incrementSuccessfulResponses(metrics);
            } else if (reply.statusCode >= 400) {
                this.incrementErrorResponses(metrics);
            }
            done();
        };
    }
};