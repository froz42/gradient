import { StringOption } from 'necord';

export class PlayDto {
  @StringOption({
    name: 'url',
    description: 'Youtube url',
    required: true,
  })
  url: string;
}
