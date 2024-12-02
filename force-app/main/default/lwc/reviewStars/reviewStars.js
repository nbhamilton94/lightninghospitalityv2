import { LightningElement, api } from 'lwc';



export default class ReviewStars extends LightningElement {

    @api reviewScore;

    get stars() {
        const starsArray = [];
        for (let i = 0; i < this.reviewScore; i++) {
            starsArray.push({
                id: `star-${i}`,
                icon: '⭐'
            });
        }
        return starsArray;
    }

    connectedCallback() {
        console.log("REVIEW SCORE: " + this.reviewScore);
    }

}