import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#particules-canvas")!;

const ctx = canvas.getContext("2d")!;
ctx.fillStyle = "#000000";
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);



canvas.style.background = "#000000";
ctx.fillRect(0, 0, width, height);
//l'opacité  
ctx.globalAlpha = 0.2;

// variables globales 

let positionX: number;
let positionY: number;

// Tableau vide pour pouvoir stocker les différents cercles par la suite

const arrayCircle: Circle[] = [];


let audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();


//Oscillateur
const oscillator = audioContext.createOscillator();
oscillator.type = "square"; // Valeur possible (sine, square, triangle, sawtooth,... etc.)
oscillator.frequency.setValueAtTime(340, audioContext.currentTime);

// Connexion de l'oscillateur à la destination audio
oscillator.connect(audioContext.destination);

// Fonction pour démarrer la chute de fréquence
function startChute() {
    const currentTime = audioContext.currentTime;
    oscillator.frequency.setValueAtTime(340, currentTime); // Définir la fréquence de départ

    const dureeChute = 3.0; // Durée de la chute en secondes
    const frequence = 0; // Fréquence à zéro pour ne plus rien entendre


    // Définir la fréquence minimale à la fin de la chute
    oscillator.frequency.linearRampToValueAtTime(frequence, currentTime + dureeChute);
}


// La création d'une class cercle 
export class Circle {
    positionInitialeX: number;
    positionInitialeY: number;
    nouvellePositionX: number;
    nouvellePositionY: number;
    color: any;
    radius: number;
// Variables locales
xNew: number;
yNew: number;

    //   Le constructeur est comme la "recette" qu'on doit suivre 
    constructor(
        positionInitialeX: number,
        positionInitialeY: number,
        nouvellePositionX: number,
        nouvellePositionY: number
    ) {
        this.positionInitialeX = positionInitialeX;
        this.positionInitialeY = positionInitialeY;
        this.nouvellePositionX = nouvellePositionX;
        this.nouvellePositionY = nouvellePositionY;
        this.color = this.generateColor();
        this.radius = Math.floor(Math.random() * 50);;
this.xNew = positionInitialeX;
this.yNew = positionInitialeY;

    }

    //   Méthode pour permettre de créer une couleur aléatoire des cercles
    generateColor() {
        return "#" + Math.random().toString(16).slice(2, 8);
    }

    //   Méthode pour permettre de créer un rayon aléatoire des cercles
    //generateRadius() {
        //return Math.floor(Math.random() * 100);
    //}

    //   Méthode pour créer du mouvement (la position initiale devient la nouvelle position )
    movement() {
        this.positionInitialeX += this.nouvellePositionX;
        this.positionInitialeY += this.nouvellePositionY;
    }

    //   Méthode pour créer un cercle - utilisation de l'API canvas
    drawCircle(ctx: CanvasRenderingContext2D) {
/*   const trailAlpha = .point.alpha - i* trailAlphaDecay; 
   if (trailAlpha <= 0) {
 break;

   }*/
   
    // Calcul de  l'hypothènus en utlisant le thééorème de Pythagore 
/*const distanceNew = Math.sqrt((this.positionInitialeX - this.xNew) ** 2 + (this.positionInitialeY - this.yNew) ** 2);


        //Nouveau rayon  en réduisant le rayon actuel 
        // descendra jamais en dessous de 1.Pour que le diamètre du point dimninue en fonction de la 
        // distance parcourue.
const radius = Math.max(1, this.radius - distanceNew / 10);*/
/*
 //Creation du dégradé 
const gradient = ctx.createRadialGradient(this.positionInitialeX, this.positionInitialeY, 1, this.positionInitialeX, this.positionInitialeY, radius);
const gradientIntensity = this.calculateGradientIntensity(distanceNew);
        
gradient.addColorStop(0, this.color);
gradient.addColorStop(1, `rgba(255, 255, 255, ${gradientIntensity})`);

ctx.fillStyle = gradient;*/


        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.positionInitialeX, this.positionInitialeY, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();


    }



/*drawTrail(ctx: CanvasRenderingContext2D, trailLength: number) {
    const trailOpacity = 0.08;
    const trailEndX = this.positionInitialeX - this.nouvellePositionX * trailLength;
   const trailEndY = this.positionInitialeY - this.nouvellePositionY *trailLength;

    ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`;
    ctx.lineWidth = this.radius/6;*/
    //ctx.beginPath();
/*calculateGradientIntensity(distance: number): number {
    const maxDistance = 100;
    return Math.min(1, 1 - distance / maxDistance);
}*/

}

// Création d'une fonction pour générer un nouveau cercle
function createNewCircle() {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 40;
    let nouvellePositionX = Math.cos(angle) * distance;
    let nouvellePositionY = Math.sin(angle) * distance;

    const circle = new Circle(
        positionX,
        positionY,
        nouvellePositionX,
        nouvellePositionY
    );
    // Stocker les cercles dans le tableau de cercles
    arrayCircle.push(circle);


    //  Cela permet d'écouter le clique de la souris et de récupérer la position de la souris
    let soundActivated = false;
    canvas.addEventListener("click", (e) => {
        e.preventDefault;
        positionX = e.clientX;
        positionY = e.clientY;
        createNewCircle();
        // Si le son n'a pas encore été activé, activez-le
        if (!soundActivated) {
            startChute();
            soundActivated = true;
        }

        oscillator.start(audioContext.currentTime);
        startChute();


    });

}

// Boucle pour créer de nouveaux cercles
for (let i = 0; i < 100; i++) {
    createNewCircle();
}

// Fonction pour mettre à jour et dessiner les cercles
function updateAndDrawCircles() {
    ctx.clearRect(0, 0, width, height); // Efface le canvas à chaque mise à jour
// Parcourir le tableau de cercle et les faire deplacer 
    for (const circle of arrayCircle) {
        circle.movement();
        circle.drawCircle(ctx);
    }



    requestAnimationFrame(updateAndDrawCircles); // Appel récursif pour l'animation
}

updateAndDrawCircles(); // Démarrer l'animation
/*
// Réduire progressivement l'opacité du point
        point.alpha -= 0.009; // Vous pouvez ajuster ce chiffre pour changer la vitesse de disparition

        // Supprimer le point s'il est trop transparent
        if (point.alpha <= 0) {
            points.splice(i, 1);
            i--;

}*/
       // }

