import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto, UpdateEventDto } from './dto/create-update-event.dto';
import { Events } from '../../entities/events.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly eventsRepository: Repository<Events>,
  ) {
  }

  public async create(dto: CreateEventDto): Promise<Events> {
    const event = this.eventsRepository.create(dto);
    return await this.eventsRepository.save(event);
  }

  public async findAll(): Promise<Events[]> {
    return await this.eventsRepository.find();
  }

  public async findOne(id: string): Promise<Events> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  public async update(id: string, dto: UpdateEventDto): Promise<Events> {
    const event = await this.findOne(id);
    Object.assign(event, dto);
    return await this.eventsRepository.save(event);
  }

  public async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }
}