import { Router } from 'express';
import { plantsController } from '../controllers/plants.controller.js';
import { careLogsController } from '../controllers/careLogs.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
    createPlantValidator,
    updatePlantValidator,
    idValidator,
    listPlantsValidator,
} from '../validators/plants.validator.js';
import {
    createCareLogValidator,
    listCareLogsValidator,
} from '../validators/careLogs.validator.js';

export const plantsRouter = Router();

plantsRouter.use(authenticate);

plantsRouter.get('/', validate(listPlantsValidator), plantsController.list);
plantsRouter.post('/', validate(createPlantValidator), plantsController.create);
plantsRouter.get('/:id', validate(idValidator), plantsController.get);
plantsRouter.patch('/:id', validate(updatePlantValidator), plantsController.update);
plantsRouter.put('/:id', validate(updatePlantValidator), plantsController.update);
plantsRouter.delete('/:id', validate(idValidator), plantsController.remove);

plantsRouter.get('/:plantId/care-logs', validate(listCareLogsValidator), careLogsController.list);
plantsRouter.post('/:plantId/care-logs', validate(createCareLogValidator), careLogsController.create);