import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/eventService';
import { IngestionService } from '../services/ingestionService';
import { ResponseUtil } from '../utils/apiResponse';

export class EventController {
  private eventService: EventService;
  private ingestionService: IngestionService;

  constructor() {
    this.eventService = new EventService();
    this.ingestionService = new IngestionService();
  }

  public getEvents = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { category, location, search } = req.query;
      const events = await this.eventService.getEvents({
        category: category as string,
        location: location as string,
        search: search as string,
      });
      return ResponseUtil.success(res, events, 'Events fetched successfully');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 500);
    }
  };

  public getEventById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      return ResponseUtil.success(res, event, 'Event details fetched');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 404);
    }
  };

  public importEvents = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const payload = Array.isArray(req.body) ? req.body : [req.body];
      const imported = await this.ingestionService.importEventsFromPayload(payload);
      return ResponseUtil.success(res, imported, `Successfully imported ${imported.length} event(s)`, 201);
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };

  public analyzeEvent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const eventId = req.params.id;
      const reanalyzed = await this.eventService.reanalyzeEvent(eventId);
      return ResponseUtil.success(res, reanalyzed, 'Event intelligence analysis completed');
    } catch (err: any) {
      return ResponseUtil.error(res, err.message, 400);
    }
  };
}
