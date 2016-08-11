// master_script.js
// last updated 8/11/16 by HA
// for HiFi Study

/*

keypress:
m - display counter
b - display wall
c - countdown the counter
r - rest the counter to 20
v - start the 5 minute countdown and the wall shows up again
f - fix the arm movement

 */


function overrideAnims() {
    var excludedRoles = ["rightHandGraspOpen",
                         "rightHandGraspClosed",
                         "leftHandGraspOpen",
                         "leftHandGraspClosed"];

    var IDLE_URL = "http://hifi-content.s3.amazonaws.com/ozan/dev/anim/standard_anims_160127/idle.fbx";

    var skeletonModelURL = MyAvatar.skeletonModelURL;
    var jointCount = MyAvatar.jointNames.length;
    var roles = MyAvatar.getAnimationRoles();
    var length = roles.length;

    for (var i = 0; i < length; i++) {
        if (excludedRoles.indexOf(roles[i]) == -1) {
            // override all the avatar motions into IDLE motion
            MyAvatar.overrideRoleAnimation(roles[i], IDLE_URL, 30, false, 1, 1);
        }
    }
}

// update motion every second manually
var t = 0;
function update(dt) {
    t += dt;
    if (t > 1) {
        overrideAnims();
        t = 0;
    }
}

overrideAnims();

Script.update.connect(update);
Script.scriptEnding.connect(function () {
    Script.update.disconnect(update);
})






// Enable/disable visibility of the wall
// 'b'
var wall = '5af10887-444c-4283-928d-059644ca36e8';
var visible = Entities.getEntityProperties(wall, visible);

Controller.keyPressEvent.connect(function(key) {
    print("you pressed " + key.text);
    if (key.text == 'b') {
        visible = !visible;
        Entities.editEntity(wall, {visible: visible});
    }
});


// Countdown the counte by 1
// 'c'
var numtext1 = 'bd153e01-3247-433a-b06d-023f2c435851';
var numtext2 = 'ca72b2d1-f0ce-47b8-9a49-1525bc076a55';

var num = 20;

Entities.editEntity(numtext1, {text: num});
Entities.editEntity(numtext2, {text: num});


Controller.keyPressEvent.connect(function(key) {
    if (key.text == 'c') {
        if (num > 0) {
            num--;
        } else {
            num = 20;
        }

        Entities.editEntity(numtext1, {text: num});
        Entities.editEntity(numtext2, {text: num});
    }
});


// Reset the counter to 20
// 'r'
Controller.keyPressEvent.connect(function(key) {
    if (key.text === 'r') {
        Entities.editEntity(numtext1, {text: 20});
        Entities.editEntity(numtext2, {text: 20});
    }
});



// Enable/disable visibility for numtext1 and numtext2
// 'm'
var visible_counter = Entities.getEntityProperties(original_numtext1, visible);

Controller.keyPressEvent.connect(function(key) {
    if (key.text == 'm') {
        visible_counter = !visible_counter;
        Entities.editEntity(numtext1, {visible: visible_counter});
        Entities.editEntity(numtext2, {visible: visible_counter});
    }
});


// After 5 minutes, the wall will come back up
// 'v'
Controller.keyPressEvent.connect(function(key) {
    if (key.text == 'v') {
        visible = !visible;
        if (!visible) {
            Entities.editEntity(wall, {visible: visible});
        } else {
            Script.setTimeout(function () {
                Entities.editEntity(wall, {visible: visible});
            }, 300000);
        }
    }
});






// Create a new mapping object
var mapping = Controller.newMapping("zero");

// Add a route to the mapping object
// fix lefthand controller
mapping.from(Controller.Standard.LeftHand).to(function (value) {
    return Vec3.ZERO;
});

// fix righthand controller
mapping.from(Controller.Standard.RightHand).to(function (value) {
    return Vec3.ZERO;
});


// Enable/disable hand movement via controller
// 'f'
var controllerFixed = false;
Controller.keyPressEvent.connect(function(key) {
    if (key.text == 'f') {
        if (controllerFixed === false) {
            controllerFixed = true;
            print("controller fix enabled.");
            Controller.enableMapping("zero");
        } else {
            controllerFixed = false;
            print("controller fix disabled.");
            Controller.disableMapping("zero");
        }
    }
});
