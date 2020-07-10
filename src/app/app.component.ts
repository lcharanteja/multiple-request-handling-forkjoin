import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, take } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {
  userName;
  posts;
  albums;
  user;

  constructor(private http: HttpClient) { 
    this.posts = [];
    this.albums = [];
    this.userName = 'XXX';
  }

  ngOnInit() {
    // this.getDataByUsingSubscribe();
    // this.getDataByUsingMergeMap();
    // this.getDataByUsingForkJoin();
    this.combine2Techniques();
  }

  getDataByUsingSubscribe() {
    this.http.get('https://jsonplaceholder.typicode.com/users?username=Bret')
    .pipe(
      map( users => users[0]), 
      take(1)
    )
    .subscribe( user => {

      this.userName = user.username;

      this.http.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
      .subscribe( posts => {
        this.posts = posts;
      });

      this.http.get(`https://jsonplaceholder.typicode.com/albums?userId=${user.id}`)
      .subscribe( albums => {
        this.albums = albums;
      });
    });
  }

  getDataByUsingMergeMap() {
    this.http.get('https://jsonplaceholder.typicode.com/users?username=Bret').pipe(
      map( users => {
        const user = users[0];
        this.userName = user.username;
        return user;
      }),
      mergeMap( user => this.http.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)),
      take(1)
    ).subscribe( posts => {
       this.posts = posts;
    });
  }

  getDataByUsingForkJoin() {
    const posts = this.http.get(`https://jsonplaceholder.typicode.com/posts?userId=1`);
    const albums = this.http.get(`https://jsonplaceholder.typicode.com/albums?userId=1`);

    forkJoin([posts, albums]).pipe(take(1)).subscribe( result => {
      this.posts = result[0];
      this.albums = result[1];
    });
  }

  combine2Techniques() {
    this.http.get('https://jsonplaceholder.typicode.com/users?username=Bret').pipe(
      map( users => {
        const user = users[0];
        this.userName = user.username;
        return user;
      }),
      mergeMap( user => {
        const posts = this.http.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
        const albums = this.http.get(`https://jsonplaceholder.typicode.com/albums?userId=${user.id}`);

        return forkJoin([posts, albums, of(user)]);
      }),
      take(1)
    ).subscribe( result => {
        this.posts = result[0];
        this.albums = result[1];
        this.user = result[2]
    });
  }
}
