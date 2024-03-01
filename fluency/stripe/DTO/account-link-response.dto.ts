import { ApiProperty } from '@nestjs/swagger';

export class AccountLinkResponseDTO {
  @ApiProperty()
  accountLink: string;
}
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCjuvbrS3EU9Wl8T2gSS4tQwUjNazgIq4KHi5sVQSOznd4QvLjlc+3QiABA3jMTwrrIMmRvSuqk2wpE7vzwXYNicQN4OCaBAxuKyefyi5C0dNQAfi+BuUeO6910Kdpvq5BlwVGmMTsiEb7CPbaMC7/gitPULkxBMDhwUYVhM1Yos0j5eIvWjFJ79i