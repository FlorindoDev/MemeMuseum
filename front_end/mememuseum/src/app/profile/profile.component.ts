import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';
import { UserService } from '../_services/user/user.service';
import { MemeService } from '../_services/meme/meme.service';
import { User } from '../_services/user/user.type';
import { Meme } from '../_services/meme/meme.type';
import { environment } from '../environment.prod';
import { LoadingScreen } from '../loading-screen/loading-screen.component';
import { DragAndDrop } from '../drag-and-drop/drag-and-drop.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  imports: [LoadingScreen, DragAndDrop],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class Profile {

  idUser: string = "0";
  memes: Meme[] = [];
  user: User | null = null;
  speak = { w: "w-32", h: "h-32", rounded: "rounded-full", text: false };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth_service: AuthService,
    private user_service: UserService,
    private meme_service: MemeService,
    private toaster: ToastrService
  ) { }

  onClickUpload(event: Event) {
    let element = (event.currentTarget as HTMLElement);
    element.parentElement?.classList.add('hidden');
    document.getElementById("drag-profilepic")?.classList.remove('hidden');
  }

  closeUpload() {
    document.getElementById('profile-img')?.classList.remove("hidden");
    document.getElementById("drag-profilepic")?.classList.add('hidden');
  }

  upload(event: File) {
    if (this.auth_service.isAuthenticated()) {
      this.user_service.uploadprofilePic(Number(this.user?.idUser), event).subscribe({
        next: (val) => {
          this.user_service.updateProfilePic(val.url);
          setTimeout(() => {
            localStorage.setItem('showToasterAfterReload', 'true');
            window.location.reload();
          }, 30);

        }
      });
    }
  }

  removePulse(event: Event): void {
    event.stopPropagation();
    (event.currentTarget as HTMLElement).parentElement?.classList.remove('animate-pulse');
  }

  loadLoggedUser(idUser: string) {
    if (this.checkUsers(idUser)) {
      this.user = { nickName: "", email: "", profilePic: null }
      this.user.idUser = this.route.snapshot.paramMap.get('id') as string;
      this.user.profilePic = this.user_service.getProfilePic();
      this.user.nickName = this.user_service.getNickName() as string;
      this.user.email = this.auth_service.getUser() as string;
    }
  }

  checkUsers(idUser: string): boolean {
    if (this.auth_service.isAuthenticated()) {
      if (this.auth_service.getidUser() == idUser) {
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
        if (!user) {
          this.toaster.warning("Tra poco sarai reindirizzato alla home", "L'utente non esiste!!");
          setTimeout(() => {
            this.router.navigate(["/"]);
          }, 5000);
        }
        if (!user.profilePic) user.profilePic = environment.noProfilePic;
        this.user = user;
      }
    })
  }

  ngOnInit() {
    let idUser = this.route.snapshot.paramMap.get('id') as string;
    if (idUser && !isNaN(Number(idUser))) {
      this.idUser = idUser;
      if (!this.checkUsers(idUser)) this.fetchUser(idUser);
      else this.loadLoggedUser(idUser);
      this.fetchMemes(idUser);
    }

    if (localStorage.getItem('showToasterAfterReload') === 'true') {
      this.toaster.success("Foto profilo caricata", "Successo caricamento");
      localStorage.removeItem('showToasterAfterReload');
    }

  }

  toUserPost(event: Event) {
    const target = event.target as HTMLElement;

    this.router.navigate([`memes/${target.id}`]);
  }

}
