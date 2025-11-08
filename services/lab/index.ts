import cancelLabRequest from "./cancelLabRequest.service";
import createLabRequest from "./createLabRequest.service";
import createLabService from "./createLabService.service";
import finishLabTest from "./finishLabTest.service";
import getLabServices from "./getLabServices.service";
import getLabTestById from "./getLabTestById.service";
import getLabTestRequests from "./getLabTestRequests.service";
import getLabTests from "./getLabTests.service";
import startLabTest from "./startLabTest.service";

const labService = {
  createLabService,
  getLabServices,
  createLabRequest,
  cancelLabRequest,
  getLabTestRequests,
  getLabTests,
  startLabTest,
  finishLabTest,
  getLabTestById,
};

export default labService;
