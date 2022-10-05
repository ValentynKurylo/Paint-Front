import {makeAutoObservable} from "mobx";


class UserState{


    CurrentUser = {
        id: null,
        username: "",
        email: "",
        role: ""
    }

    token = null

    people = []
    showUserState = {}
    userFriends = []
    friendId = null
    userPicture = []

    constructor() {
        makeAutoObservable(this)
    }

    setCurrentUser(user){
        this.CurrentUser = user
    }

    setToken(token){
        this.token = token
    }

    setPeople(people){
        this.people = people
    }

    setShowUserState(user){
        this.showUserState = user
    }
    setUserFriends(friends){
        this.userFriends = friends
    }
    setFriendId(id){
        this.friendId = id
    }
    setUserPicture(pictures){
        this.userPicture = pictures
    }

}

export default new UserState();