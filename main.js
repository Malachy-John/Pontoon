window.onload = init;

//these track the player's wins and losses
let losses = 0;
let wins = 0;
//here we get the document elements by their respective ids
let player_total_text = document.getElementById("player_total");
let robot_total_text = document.getElementById("robot_total");
let start_button = document.getElementById("start-game");
let hit_button = document.getElementById("hit-me");
let stay_button = document.getElementById("stay-me");
let status_text = document.getElementById("round_status");

//create an empty "all cards to play"
let all_cards_to_play = [];

//these are the 13 cards of each suite
let cards_names =["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"]
//these are the 4 suits that could be played
let cards_suits =["of Clubs", "of Diamonds", "of Hearts", "of Spades"]

//these will be used to display the cards played of each player in text form.
let player_cards_text = document.getElementById("player_cards");
let dealer_cards_text = document.getElementById("robot_cards");

//when user starts the website make sure they can't access this functionality
stay_button.disabled = true;
hit_button.disabled = true;


//this is the player object/dictionary which holds a lot of their respective details
let player_dict = {
    //user's total
    player_total_val: 0,
    //the actual card number out of 52: Eg card 42, 7, 18
    player_cards: [],

    //the respective player_cards transformed into their point values
    player_points: [],
    //not the dealer
    robot: false,
    //if player has pontoon
    pontoon: false,
    //if player has five cards on board
    five_card: false,
    //the string representations of the cards
    player_card_strings: [],
};

//as above, but for the dealer
let robo_dict = {
    player_total_val: 0,
    player_cards: [],
    player_points: [],
    //this user is dealer
    robot: true,
    pontoon: false,
    five_card: false,
    player_card_strings:[],
};

//this lets us know how many times a respective "round" by each player is played.
let count = 0;


//add an event listener so that user can use the hit_action functionality
hit_button.addEventListener("click", function () {
    hit_action(player_dict);
});


//add event listener so that user can use stay functionality
stay_button.addEventListener("click", () => { stay_action() })


//on window load
function init() {


    //player total set to 0
    player_total_text.innerHTML = "Player Total: 0";
    //add an event listener to the start button
    start_button.addEventListener("click", start_game);


}

//this starts a round of pontoon
function start_game() {
    //disable the start button so user cannot cheat
    start_button.disabled=true;

    //cut off this functionality so user can't hit stay before 16
    stay_button.disabled = true;
    //set the count to 0
    count = 0;

    //the status text is reverted to nothing
    status_text.innerHTML = "";

    //the players total is displayed here
    player_total_text.innerHTML = "Player Total: 0";
    //the dealers total is displayed here
    robot_total_text.innerHTML = "Dealer Total: 0";

    //player cards strings are reverted to this
    player_cards_text.innerHTML = "Player Cards ";

    //dealers cards strings are reverted to this
    dealer_cards_text.innerHTML = "Dealer Cards ";

    //reset player_dict
    player_dict = {
        player_total_val: 0,
        player_cards: [],
        player_points: [],
        robot: false,
        pontoon: false,
        five_card: false,
        player_card_strings: [],
    };
    //reset robo_dict
    robo_dict = {
        player_total_val: 0,
        player_cards: [],
        player_points: [],
        robot: true,
        pontoon: false,
        five_card: false,
        player_card_strings: [],
    };

    //get the id of the images tag for player
    let my_images = document.getElementById("myImg");
    //get the id of the images tag for robot
    let robo_images = document.getElementById("roboImg");

    //set all the cards to play to empty
    all_cards_to_play = [];

    //from 1 to 52 fill array with int
    for (let i = 0; i < 52; i++) {
        all_cards_to_play.push(i + 1);
    }

    //flush the images from players cards
    while (my_images.firstChild) {
        my_images.removeChild(my_images.lastChild);
    }

    //flush the images from robots cards
    while (robo_images.firstChild) {
        robo_images.removeChild(robo_images.lastChild);
    }

    //hit button is enabled
    hit_button.disabled = false;

    //we draw two cards to player
    for (let i = 0; i < 2; i++) {
        //we pass the specific object to be used
        hit_action(player_dict);
    }




}

//this is the primary functionality, it draws cards from deck and plays them
//note the specific dictionary object can be player or dealer dict
function hit_action(dictionary) {

    //use these strings to allow for string representations of the cards
    let temp_string = "";
    let o_t_string = "";

    //get a random value of 1 - 52 from this function
    let random_value = random_card();

    //if count becomes greater than 3, disable the hit button
    if (count > 3) {
        hit_button.disabled = true;
    }

    //check to see if the all cards left to play left still has that random value
    if (all_cards_to_play.includes(random_value)) {
        console.log("COUNT IS: " + count++);

        //add to player/dealer cards pile
        dictionary["player_cards"].push(random_value);
        
        //find the index of this card and remove it with splice
        let index = all_cards_to_play.indexOf(random_value);
        all_cards_to_play.splice(index, 1);

        //find the numeric value of the cards (2 - 11 (with ace being 1 or 11))
        //find a string representation of the cards while youre at it
        let card_value = calculate_card_value(dictionary, random_value)


        //add to the respective object strings
        for(let v of dictionary["player_card_strings"]){
            temp_string += v + "<br>";
        }

        if(dictionary["robot"]){
            //if we're dealing with robot do this
            o_t_string = "Dealer Cards<br> ";
            dealer_cards_text.innerHTML = o_t_string + temp_string;
        }else{
            o_t_string = "Player Cards<br> "
            //else we're adding it to the player's cards
            player_cards_text.innerHTML = o_t_string + temp_string;
        }


        //push the point value to the array
        dictionary["player_points"].push(card_value);

        //make sure that the total value is set to 0.
        dictionary["player_total_val"] = 0;
        //for all values in player points, add them up
        for (let val of dictionary["player_points"]) {
            dictionary["player_total_val"] += val;
        }
        //when player/dealer has 21 points
        if (dictionary["player_total_val"] == 21) {
            //if they have 2 cards, pontoon activated
            if (dictionary["player_points"].length == 2) {
                dictionary["pontoon"] = true;
            }
            //disable the hit button as its no longer needed
            hit_button.disabled = true;
        }

        //if the total is greater than 21, activate this
        else if (dictionary["player_total_val"] > 21) {


            //we're checking to see if there's some aces in the player/dealers hand
            let check_val = check_state(dictionary);
            //if there's not its player loss or win
            if (check_val == false) {
                hit_button.disabled = true;
                //if its not the dealer, player loses
                if (!dictionary["robot"]) {
                    player_loss();
                } else {
                    //it is is the player, player wins
                    player_win();
                }
            } else {
                //double checks if the hit_button will be disabled, just to make sure ace dropping point value doesn't affect this functionality
                if (count > 4) {
                    hit_button.disabled = true;
                } else {
                    hit_button.disabled = false;
                }

            }
        }

        //if its not robot object
        if (!dictionary["robot"]) {
            //create an image element
            let img = document.createElement('img');
            //find the source from images folder
            img.src = `images/${dictionary["player_cards"].at(-1)}.png`

            //get the document.getelement by id and append this newly created image
            document.getElementById("myImg").appendChild(img);
            //update the player total value
            player_total_text.innerHTML = `Player Total: ${dictionary["player_total_val"]}`;
        } else {
            let img = document.createElement('img');
            img.src = `images/${dictionary["player_cards"].at(-1)}.png`

            //add the new image to the dealer's hand
            document.getElementById("roboImg").appendChild(img);
            robot_total_text.innerHTML = `Dealer Total: ${dictionary["player_total_val"]}`;
        }


    //if the user draws a random number that has already been drawn, activate this
    } else {
        //drop counter by 1
        count--;
        //recursively call this function again.
        hit_action(dictionary);

    }

    //this is to make sure stay button turns off if player goes below 16
    //such an example will be if an ace is drawn and players total is now < 16 or > 21
    if (dictionary["player_total_val"] < 16 && player_dict["player_points"].length < 5) {
        stay_button.disabled = true;
    }

    //if player has 5 cards, even if below 16 points, they must stay
    if (dictionary["player_total_val"] >= 16 || player_dict["player_points"].length == 5) {
        stay_button.disabled = false;
    }

    //stop player from staying if total hits over 21.
    if (dictionary["player_total_val"] > 21) {
        stay_button.disabled = true;
    }


}


//from here we access the dealer/robot's functionality
function stay_action() {

    //check if player has 5 cards
    if (player_dict["player_points"].length == 5) {
        player_dict["five_card"] = true;
    }

    //this works similarly to a loop
    let keep_going = true;

    //draw two cards for dealer
    for (let i = 0; i < 2; i++) {
        hit_action(robo_dict);
    }

    //this means the robot auto wins, regardless of player cards.
    if (robo_dict["player_total_val"] == 21) {
        player_loss();
        keep_going = false;
    }


    //check if player has achieved the pontoon
    if (player_dict["pontoon"] && keep_going) {
        player_win();
        keep_going = false;

    }

    //OK - keep going if user has 5 cards.
    if (robo_dict["player_total_val"] >= player_dict["player_total_val"] && keep_going) {
        if (!player_dict["five_card"]) {
            player_loss();
            keep_going = false;
        } else if (player_dict["five_card"]) {
            keep_going = true;
        }
    }

    //1st hit action - for 3rd card
    if (keep_going) {
        hit_action(robo_dict);
    }

    //if keep going becomes false player will win point awarded
    if (robo_dict["player_total_val"] > 21 && keep_going) {
        keep_going = false;
    }

    //robot has 21 points, user does not have 5 cards, player loses
    else if (robo_dict["player_total_val"] == 21 && !(player_dict["five_card"])) {
        player_loss();
        keep_going = false;
    }

    //robot has greater points than player, player does not have 5 cards, player loses
    else if (robo_dict["player_total_val"] >= player_dict["player_total_val"] && keep_going) {
        if (player_dict["five_card"]) {
            keep_going = true;
        } else {
            console.log("player did not have 5 cards...");
            player_loss();
            keep_going = false;
        }

    }

    //2nd hit action - for 4th card
    if (keep_going) {
        hit_action(robo_dict);
    }

    //if robot has greater than 21 points, player is awarded point
    if (robo_dict["player_total_val"] > 21 && keep_going) {
        keep_going = false;
    }

    //player loses if robot gets 21 points + player does not have 5 cards
    else if (robo_dict["player_total_val"] == 21 && !(player_dict["five_card"])) {
        player_loss();
        keep_going = false;
    }

    //player loses if robot gets more points and player does not have 5 cards
    else if (robo_dict["player_total_val"] >= player_dict["player_total_val"] && keep_going) {
        if (player_dict["five_card"]) {
            keep_going = true;
        } else {
            player_loss();
            keep_going = false;
        }


    }

    //3rd hit action - 5th card
    if (keep_going) {
        hit_action(robo_dict);
    }

    //robot loses, player wins
    if (robo_dict["player_total_val"] > 21 && keep_going) {
        keep_going = false;
    }

    //robot now has five cards
    if (robo_dict["player_total_val"] <= 21) {
        robo_dict["five_card"] = true;
    }
    //Robot will always win on 5 cards if the player does not also have 5 cards
    if (robo_dict["five_card"] == true && player_dict["player_cards"].length < 5 && keep_going) {
        keep_going = false;
        player_loss(); 

    //if all three are true, check to see the total value of player cards > robot cards
    } else if (robo_dict["five_card"] && player_dict["five_card"] && keep_going) {
        if (player_dict["player_total_val"] > robo_dict["player_total_val"]) {
            player_win();
        } else {
            player_loss();
        }
    }
    //disable this to make sure user cant access this functionality
    stay_button.disabled = true;
}

//need to pass dictionary here
function check_state(dictionary) {
    //index default -1
    let index = -1;

    //for value in player points check to see if any are 11
    //if they are, check the index of the ace
    for (let i = 0; i < dictionary["player_points"].length; i++) {
        if (dictionary["player_points"][i] == 11) {
            index = i;
            console.log(index);
        }
    }
    //set the new player points value from 11 to 1
    //remove 10 from the total
    if (index != -1) {
        dictionary["player_points"][index] = 1;
        dictionary["player_total_val"] -= 10;
    }
    //if the index is -1 return a false
    if (index === -1) {
        return false;
    }
    return true;


}

//we check that the player has lost and set status text to lose state
function player_loss() {
    status_text.innerHTML = "YOU LOSE!";
    let loss = document.getElementById("player_loss");
    //add a loss to the int values
    loss.innerHTML = `Player Loss: ${++losses}`;
    //make hit button disabled and allow player to start again
    start_button.disabled = false;
    hit_button.disabled = true;
}

//this is activated when player wins
function player_win() {
    status_text.innerHTML = "YOU WIN!";
    let winner = document.getElementById("player_wins");
    winner.innerHTML = `Player Wins: ${++wins}`;
    //make hit button disabled and allow player to start again
    start_button.disabled = false;
    hit_button.disabled = true;
}

//this returns a random number from 1 - 52
function random_card() {
    return Math.floor((Math.random() * 52) + 1);
}

//this allows us to find the in values [1- 11] of the card and find a string representation of the card
function calculate_card_value(dictionary, value) {
    //modifier changes depending on the number value given to it.
    let modifier = 0;
    let suit_string = "";
    let value_string ="";
    //its a spade
    if (value > 39) {
        suit_string = cards_suits[3];
        modifier = 39;
    //its a heart
    } else if (value > 26) {
        suit_string = cards_suits[2];
        modifier = 26;
    //its a diamond
    } else if (value > 13) {
        suit_string = cards_suits[1];
        modifier = 13;
    //its a club
    }else{
        suit_string = cards_suits[0];
    }

    //this will give the actual point worth of the card
    //eg if value is 42, then we will have a spade and 39 will be subtracted
    //giving us a 3 of spade 
    value -= modifier;

    //we have to find the string representation of this number
    value_string = cards_names[value-1];

    //this lets us double check it should look right in console
    console.log(value_string + " " +  suit_string );

    //push the card into the player/dealers string representation array
    dictionary["player_card_strings"].push("•" + " " + value_string + " " + suit_string);

    //if value is greater than 10... it becomes 10
    if (value > 10) {
        value = 10;
    }

    //if the value passed was 1, its now 11 (ace)
    if (value === 1) {
        value = 11
    }

    //return the value 1 - 11
    return value;



}