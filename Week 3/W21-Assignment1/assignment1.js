import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class Square extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, 0], [-1, 1, 0], [1, -1, 0], [-1, 1, 0], [1, -1, 0], [1, 1, 0],
        );
        this.arrays.normal = Vector3.cast(
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1],
        )
        // Arrange the vertices into a square shape in texture space too:
        // this.indices.push(0, 1, 2, 1, 2, 3);
    }
}


class Cube_Outline extends Shape {
    constructor() {
        super("position", "color");
        this.arrays.position = Vector3.cast(
            [-1, -1, 0], [-1, 1, 0],
            [-1, 1, 0], [1, 1, 0],
            [1, 1, 0], [1, -1, 0],
            [1, -1, 0], [-1, -1, 0],
        );
        this.arrays.color = [
            color(1, 1, 1, 1), color(1, 1, 1, 1),
            color(1, 1, 1, 1), color(1, 1, 1, 1),
            color(1, 1, 1, 1), color(1, 1, 1, 1),
            color(1, 1, 1, 1), color(1, 1, 1, 1),
        ]
    }
}

class Cube_Single_Strip extends Shape {
    constructor() {
        super("position", "normal");
        // TODO (Extra credit part I)
        this.arrays.position = Vector3.cast(
            [-1, -1, 0], [-1, 1, 0], [1, -1, 0],  [1, 1, 0],
        );
        this.arrays.normal = Vector3.cast(
            [-1, -1, 0], [-1, 1, 0], [1, -1, 0],  [1, 1, 0],
        )
    }
}


class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'sq': new Square(),
            'outline': new Cube_Outline(),
            'triangle_strip': new Cube_Single_Strip(),
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());
    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(5, -10, -30));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class Assignment1 extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */
    set_colors() {
        // TODO:  Create a class member variable to store your cube's colors.
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Change Colors", ["c"], this.set_colors);
        // Add a button for controlling the scene.
        this.key_triggered_button("Outline", ["o"], () => {
            // TODO:  Requirement 5b:  Set a flag here that will toggle your outline on and off
        });
        this.key_triggered_button("Sit still", ["m"], () => {
            // TODO:  Requirement 3d:  Set a flag here that will toggle your swaying motion on and off.
        });
    }

    draw_box(context, program_state, model_transform) {
        // TODO:  Helper function for requirement 3 (see hint).
        //        This should make changes to the model_transform matrix, draw the next box, and return the newest model_transform.

        return model_transform;
    }

    display(context, program_state) {
        super.display(context, program_state);
        const blue = hex_color("#1a9ffa");
        let model_transform = Mat4.identity();


        // Example for drawing a cube, you can remove this line if needed
        // this.shapes.cube.draw(context, program_state, model_transform, this.materials.plastic.override({color:blue}));
        // TODO:  Draw your entire scene here.  Use this.draw_box(context, program_state, model_transform,) to call your helper.
        // this.shapes.outline.draw(context, program_state, model_transform, this.white, "LINES");
        // this.shapes.sq.draw(context, program_state, model_transform, this.materials.plastic.override({color: blue}));
        this.shapes.triangle_strip.draw(context,program_state, model_transform, this.materials.plastic.override({color:blue}), "TRIANGLE_STRIP");
        model_transform = model_transform.times(Mat4.translation(0,2,0));
        model_transform = model_transform.times(Mat4.rotation(Math.PI/10, 0,0,1));
        this.shapes.triangle_strip.draw(context,program_state, model_transform, this.materials.plastic.override({color:blue}), "TRIANGLE_STRIP");
    }
}