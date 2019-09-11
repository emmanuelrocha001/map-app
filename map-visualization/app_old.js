// Jimp.read('../assets/test-map.png')
// .then(image => {
//     // console.log('read image successfully');
//     // console.log(image);
//     console.log(Jimp.intToRGBA(image.getPixelColor(32,32))["r"]);
//     // image.greyscale()
//     //     .write('cropped-test.png');
//     // // Do stuff with the image.
// })
// .catch(err => {
//     console.log('broken');
//     // Handle an exception.
// });

// create instance of p5
new p5();
var increment_size;
const TRANSPERENCY = 50;
// const Jimp = require('jimp');
const COLOR_BLACK = color(0, 0, 0);
//map generation colors
const COLOR_ROAD = color(246, 246, 234);
const COLOR_GRASS = color(194, 221, 168);
const COLOR_BUILDING = color(255, 212,86);
const COLOR_LETTER = color(107, 92, 113 );
// const COLOR_LETTER = color()
//li
const PIXEL_VALUE_LINIENCY = 5;
const LETTER_PIXEL_VALUE_LINIENCY = 75;

const COLOR_GRAY = color(242, 242, 242);
const COLOR_WHITE = color(255, 255, 255);
//grid outline
const COLOR_BLUE = color(135, 206, 235, 100);
//selectio color
const COLOR_RED_SELECTION = color(0, 0, 100, TRANSPERENCY);

const COLOR_PURPLE = color(0, 91, 156);
const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 800;
// const CHUNCK_SIZE = 2;
var cell_size = 2;
// var chuncks = new Array();
var map_grid;
var draw_grid = false;
var grid_horizontal_chuncks;
var grid_vertical_chunks;

var slider_value = 0;


var updateQueue = new Array();
// shifts removes first element and returns it
// push adds element to end of array

//slider



$(document).ready( () => {
    console.log('Document is ready');
    // slider = document.getElementsByClassName("slider");
    // console.log(slider[0]);
    // slider_value = slider[0]["value"];

    document.getElementsByClassName("slider")[0].addEventListener("change", event => {
        console.log(event["currentTarget"]["value"]);
        slider_value = event["currentTarget"]["value"];
    }, false);
});


// var slider = document.getElementsByClassName("slider");

// console.log(slider["value"]);
function setup() {
    createCanvas( CANVAS_HEIGHT, CANVAS_WIDTH);
    pixelDensity(1);
}

var test_map_image;
function preload() {
    test_map_image = loadImage('../assets/test-map.png');

    // test_map_image
    // console.log(test_map_image);
}

// console.log(test_map_image["height"]["height"]);
// const grid = createGrid();


function createGrid()
{
    // initialize grid
    var length = Math.floor( CANVAS_WIDTH / cell_size );
    var temp_grid = new Array(length);

    for(var i=0; i < temp_grid.length; i++)
    {
        temp_grid[i] = new Array(length);
    }

    // console.log();
    // console.log(chuncks[0])
    processImage();
    // console.log(test_map_image.height);
    // getHeight();
    increment_size = Math.floor( CANVAS_WIDTH / ( test_map_image.width / cell_size) ) ;
    // console.log(Math.floor(test_map_image.width / cell_size))
    // console.log(increment_size);
    var increment = cell_size;
    for(var y=0; y < temp_grid.length; y++)
    {
        for(var x=0; x < temp_grid[y].length; x++)
        {
            temp_grid[x][y] = new Cell(increment_size*x, increment_size*y, increment_size);
        }
    }
    return temp_grid;
}

function processImage() {
    // var color_grid;
    var w;
    var h;

    Jimp.read('../assets/test-map.png')
    .then(image => {

        // image.pixelate( size[x, y, w, h ]);
        // image.normalize();
        // console.log('read image successfully');
        var map_height  = image["bitmap"]["height"];
        var map_width  = image["bitmap"]["width"];
        var horizontal_chuncks = Math.floor(map_width / cell_size);
        w = horizontal_chuncks;
        h = vertical_chuncks;
        // chuncks.push(horizontal_chuncks);
        // chuncks.push(vertical_chuncks);
        // console.log(horizontal_chuncks);
        var vertical_chuncks = Math.floor(map_height / cell_size);
        // console.log('h: %d w: %d',map_height, map_width);

        var color_grid = new Array(vertical_chuncks);

        for(var i=0; i < grid.length; i++)
        {
            color_grid[i] = new Array(horizontal_chuncks);
        }



        for(var y=0; y < vertical_chuncks; y++)
        {
            for(var x=0; x < horizontal_chuncks; x++)
            {
                var chunk_x_start_position = x * cell_size;
                var chunk_y_start_position = y * cell_size;
                var chunk_x_end_position = chunk_x_start_position + cell_size;
                var chunk_y_end_position = chunk_y_start_position + cell_size;

                for(var _y=chunk_y_start_position; _y < chunk_y_end_position; _y++)
                {
                    //process each chunk
                    var pixel_array = new Array();
                    for(var _x=chunk_x_start_position; _x < chunk_x_end_position; _x++)
                    {
                        // pixel_array.push()
                        // console.log(Jimp.intToRGBA(image.getPixelColor(_x,_y))["r"]);
                        pixel_array.push( color(Jimp.intToRGBA(image.getPixelColor(_x,_y))["r"], Jimp.intToRGBA(image.getPixelColor(_x,_y))["g"], Jimp.intToRGBA(image.getPixelColor(_x,_y))["b"] ) );
                    }
                }

                var road_pixel_count = 0;
                var building_pixel_count = 0;
                var grass_pixel_count = 0;
                var letter_pixel_count = 0;

                // console.log(pixel_array[10]["levels"][0]);
                for(i=0; i < pixel_array.length; i++)
                {

                    if( compareRGBColor( PIXEL_VALUE_LINIENCY, COLOR_ROAD["levels"][0], COLOR_ROAD["levels"][1], COLOR_ROAD["levels"][2], pixel_array[0]["levels"][0], pixel_array[0]["levels"][1], pixel_array[0]["levels"][2]) ) {
                        road_pixel_count++;
                    } else if( compareRGBColor( PIXEL_VALUE_LINIENCY, COLOR_GRASS["levels"][0], COLOR_GRASS["levels"][1], COLOR_GRASS["levels"][2], pixel_array[0]["levels"][0], pixel_array[0]["levels"][1], pixel_array[0]["levels"][2])  ) {
                        grass_pixel_count++;
                    } else if ( compareRGBColor( PIXEL_VALUE_LINIENCY, COLOR_BUILDING["levels"][0], COLOR_BUILDING["levels"][1], COLOR_BUILDING["levels"][2], pixel_array[0]["levels"][0], pixel_array[0]["levels"][1], pixel_array[0]["levels"][2]) )  {
                        building_pixel_count++;
                    } else if ( compareRGBColor( LETTER_PIXEL_VALUE_LINIENCY, COLOR_LETTER["levels"][0], COLOR_LETTER["levels"][1], COLOR_LETTER["levels"][2], pixel_array[0]["levels"][0], pixel_array[0]["levels"][1], pixel_array[0]["levels"][2]) )  {
                        letter_pixel_count++;
                    }

                }


                if(road_pixel_count > building_pixel_count && road_pixel_count > grass_pixel_count && road_pixel_count > letter_pixel_count) {
                    color_grid[x][y] = COLOR_ROAD;
                } else if(grass_pixel_count > road_pixel_count && grass_pixel_count > building_pixel_count && grass_pixel_count > letter_pixel_count) {
                    color_grid[x][y] = COLOR_GRASS;
                } else if ( building_pixel_count > road_pixel_count && building_pixel_count > grass_pixel_count && building_pixel_count > letter_pixel_count ) {
                    color_grid[x][y]  = COLOR_BUILDING;
                } else if ( letter_pixel_count > 0 ) {
                    color_grid[x][y] = COLOR_LETTER;
                } else {
                    color_grid[x][y]  = COLOR_ROAD;
                }


            }
        }

        // return color_grid;
        // console.log(color_grid.length);
        // console.log(color_grid[0].length);
        // update grid
        for(var y=0; y < color_grid.length; y++)
        {
            for(var x=0; x < color_grid[y].length; x++)
            {
                if(color_grid[x][y] == COLOR_ROAD) {
                    grid[x][y].set_type  = "road";
                } else if(color_grid[x][y] == COLOR_GRASS) {
                    grid[x][y].set_type  = "grass";
                } else if(color_grid[x][y] == COLOR_BUILDING) {
                    grid[x][y].set_type  = "building";
                } else if(color_grid[x][y] == COLOR_LETTER) {
                    grid[x][y].set_type  = "letter";
                }
            }
        }
        // console.log(grid.length);

        // console.log(Jimp.intToRGBA(image.getPixelColor(32,32))["r"]);
        // image.greyscale()
        //     .write('cropped-test.png');
        // // Do stuff with the image.
        // return("hello ");
    })
    .catch(err => {
        console.log(err);
        return 0;
        // Handle an exception.
    });
    // console.log("w: %d h: %d", w, h);
    // return color_grid;
}

function drawGrid(grid)
{
    for(var y=0; y < grid.length; y++)
    {
        for(var x=0; x < grid[y].length; x++)
        {
            // if (!grid[x][y].get_visited) {
            //     fill(COLOR_BLACK);
            // }
            // else {
            //     fill(COLOR_PURPLE);
            // }

            // draw map processed score
            if (grid[x][y].get_type != null) {
                if ( grid[x][y].get_type == "road" ) {
                    fill(COLOR_ROAD);
                } else if(grid[x][y].get_type == "grass") {
                    fill(COLOR_GRASS);
                } else if(grid[x][y].get_type == "building") {
                    fill(COLOR_BUILDING);
                } else if(grid[x][y].get_type == "letter") {
                    fill(COLOR_LETTER);
            }
                square(grid[x][y].get_x_position, grid[x][y].get_y_position, grid[x][y].get_size);

                // draw selection square
                if (grid[x][y].get_visited) {
                    fill(COLOR_RED_SELECTION);
                    square(grid[x][y].get_x_position, grid[x][y].get_y_position, grid[x][y].get_size);
                }



            }
        }
    }


}

function drawSelectionOverlayGrid() {
    for(var y=0; y < grid.length; y++)
    {
        for(var x=0; x < grid[y].length; x++)
        {
            if (grid[x][y].get_visited) {
                fill(COLOR_RED_SELECTION);
                square(grid[x][y].get_x_position, grid[x][y].get_y_position, grid[x][y].get_size);
            }
            // else {
            //     fill(COLOR_PURPLE);
            // }



        }
    }

}


function mousePressed() {
    // processImage();
    // randomPixels();
    // console.log(increment_size);
    var x_selected = Math.floor ( mouseX / increment_size );
    var y_selected = Math.floor ( mouseY / increment_size );

    if ( ( x_selected >= 0 && x_selected < grid[0].length ) && ( y_selected >= 0 && y_selected < grid.length ) )
    {
        grid[x_selected][y_selected].set_visited = (!grid[x_selected][y_selected].get_visited);
        updateQueue.push(grid[x_selected][y_selected]);
        // console.log(updateQueue);
        // console.log('x: %d y: %d', x_selected, y_selected);
    }
}



var grid;
// const map = processImage();

function keyPressed() {
    if( keyCode === ENTER ) {
        grid = createGrid();
        draw_grid = true;

        // console.log(test_map_image.height);
        // console.log( compareRGBColor(COLOR_BLUE, COLOR_BLUE) ) ;
        // processImage();
        // console.log(COLOR_BLUE["levels"]);
    }
}


function compareRGBColor(pixel_liniency, preset_r, preset_g, preset_b, current_r, current_g, current_b) {

//    console.log(pixel_liniency);
    if( ( current_r >=  ( preset_r - pixel_liniency) && current_r <=  ( preset_r + pixel_liniency) ) && ( current_g >=  ( preset_g - pixel_liniency) && current_g <=  ( preset_g + pixel_liniency) ) && ( current_b >=  ( preset_b - pixel_liniency) && current_b <=  ( preset_b + pixel_liniency) ) )  {
        return true;
    } else {
        return false;
    }
}


function draw() {
    // processImage();
    // background(COLOR_BLACK);
    stroke(COLOR_WHITE);
    // background(51);
    if (draw_grid) {

        background(COLOR_WHITE);
        drawGrid(grid);
        // drawSelectionOverlayGrid();
        // draw_grid = false;

    }

    if(slider_value != 0 ) {
        if ( slider_value != Number(document.getElementsByClassName("slider")[0]["value"]) ) {
            slider_value = Number(document.getElementsByClassName("slider")[0]["value"]);
            // console.log(slider_value);
            // if ( slider_value != 6 && slider_value != 12 && slider_value != 14  )
            // {
            cell_size = slider_value;
            // updateQueue.push(cell_size);
            grid = createGrid();
            draw_grid = true;

            // }
        }

    }
    // console.log(updateQueue);
    // selectionOverlayGrid();
    // randomPixels();
}