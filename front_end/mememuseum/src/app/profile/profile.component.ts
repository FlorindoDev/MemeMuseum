import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';
import { UserService } from '../_services/user/user.service';
import { MemeService } from '../_services/meme/meme.service';
import { User } from '../_services/user/user.type';
import { Meme } from '../_services/meme/meme.type';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class Profile {

  idUser: string | null = null;
  memes: Meme[] = [];
  user: User = { nickName: "", email: "", profilePic: null };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth_service: AuthService,
    private user_service: UserService,
    private meme_service: MemeService
  ) { }

  removePulse(event: Event): void {
    event.stopPropagation();
    (event.currentTarget as HTMLElement).parentElement?.classList.remove('animate-pulse');
  }

  checkUsers(idUser: string): boolean {
    if (this.auth_service.isAuthenticated()) {
      if (this.auth_service.getidUser() == idUser) {
        this.user.profilePic = this.user_service.getProfilePic();
        this.user.nickName = this.user_service.getNickName() as string;
        this.user.email = this.auth_service.getUser() as string;
        return true;
      }
    }
    return false;
  }

  fetchMemes(idUser: string) {
    this.meme_service.getMeme({ iduser: idUser }).subscribe({
      next: (meme: Meme[]) => {
        this.memes = meme;
      }
    })
  }

  fetchUser(idUser: string) {
    this.user_service.getUserFromId(idUser).subscribe({
      next: (user: User) => {

        this.user = user;
      }
    })
  }

  ngOnInit() {
    this.user.idUser = this.route.snapshot.paramMap.get('id') as string;
    if (this.user.idUser) {
      if (!this.checkUsers(this.user.idUser)) this.fetchUser(this.user.idUser);
      this.fetchMemes(this.user.idUser);
    }

  }

  toUserPost(event: Event) {
    const target = event.target as HTMLElement;

    this.router.navigate([`memes/${target.id}`]);
  }

}
