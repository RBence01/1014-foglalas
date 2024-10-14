import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { cinemaDTO } from './cinemaDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  index(data: cinemaDTO = { name: "", email: "", date: "", people: "1" }, errors: string[] = []) {
    return { data: data, errors: errors }
  }

  @Post()
  indexPost(@Body() body: cinemaDTO, @Res() res: Response) {
    const errors = [];
    if (!body.date || !body.email || !body.name || !body.people)
      errors.push("All fields are required!");
    if (!/^\w+[@]\w+[.]\w+$/.test(body.email))
      errors.push("Invalid email!");
    if (new Date(body.date.replace('T', ' ')).getTime() < Date.now())
      errors.push("Invalid date!");
    try {
      const people = parseInt(body.people);
      if (people < 1 || people > 10)
        errors.push("People count must be between 1-10!");
    } catch {
      errors.push("Invalid people count!");
    }

    if (errors.length == 0) res.render("success");
    else res.render("index", { data: body, errors: errors });
  }
}
