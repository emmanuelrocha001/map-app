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
// const Jimp = require('jimp');
const COLOR_BLACK = color(0, 0, 0);
//map generation colors
const COLOR_ROAD = color(246, 246, 234);
const COLOR_GRASS = color(194, 221, 168);
const COLOR_BUILDING = color(255, 212,86)

const COLOR_GRAY = color(242, 242, 242);
const COLOR_WHITE = color(255, 255, 255);
const COLOR_BLUE = color(135, 206, 235);
const COLOR_PURPLE = color(0, 91, 156);
const CANVAS_HEIGHT = 640;
const CANVAS_WIDTH = 640;
const CHUNCK_SIZE = 2;
const cell_size = 4;

var map_grid;
function setup() {
    createCanvas( CANVAS_HEIGHT, CANVAS_WIDTH);
    pixelDensity(1);
}

var test_map_image;
function preload() {
    test_map_image = loadImage('../assets/test-map.png');
}

function createGrid()
{
    // initialize grid
    var length = CANVAS_WIDTH / cell_size;
    var grid = new Array(length);

    for(var i=0; i < grid.length; i++)
    {
        grid[i] = new Array(length);
    }

    var increment = cell_size;
    for(var y=0; y < grid.length; y++)
    {
        for(var x=0; x < grid[y].length; x++)
        {
            grid[x][y] = new Cell(increment*x, increment*y, cell_size);
        }
    }
    return grid;
}

function drawGrid(grid)
{
    for(var y=0; y < grid.length; y++)
    {
        for(var x=0; x < grid[y].length; x++)
        {
            if (!grid[x][y].get_visited) {
                fill(COLOR_BLACK);
            }
            else {
                fill(COLOR_PURPLE);
            }


            if (grid[x][y].get_type != null) {
                if ( grid[x][y].get_type == "road" ) {
                    fill(COLOR_ROAD);
                } else if(grid[x][y].get_type == "grass") {
                    fill(COLOR_GRASS);
                } else if(grid[x][y].get_type == "building") {
                    fill(COLOR_BUILDING);
                }
            }
            square(grid[x][y].get_x_position, grid[x][y].get_y_position, grid[x][y].get_size);
        }
    }
}


function mousePressed() {
    // processImage();
    // randomPixels();

    var x_selected = Math.floor ( mouseX / cell_size );
    var y_selected = Math.floor ( mouseY / cell_size );

    if ( ( x_selected >= 0 && x_selected < grid[0].length ) && ( y_selected >= 0 && y_selected < grid.length ) )
    {
        grid[x_selected][y_selected].set_visited = (!grid[x_selected][y_selected].get_visited);
        console.log('x: %d y: %d', x_selected, y_selected);
    }
}

function processImage() {
    // var color_grid;

    Jimp.read('../assets/test-map.png')
    .then(image => {
        // console.log('read image successfully');
        var map_height  = image["bitmap"]["height"];
        var map_width  = image["bitmap"]["width"];
        var horizontal_chuncks = Math.floor(map_width / cell_size);
        console.log(horizontal_chuncks);
        var vertical_chuncks = Math.floor(map_height / cell_size);
        console.log('h: %d w: %d',map_height, map_width);

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

                // console.log(pixel_array[10]["levels"][0]);
                for(i=0; i < pixel_array.length; i++)
                {
                    if(pixel_array[i]["levels"][0] == COLOR_ROAD["levels"][0] && pixel_array[i]["levels"][1] == COLOR_ROAD["levels"][1] && pixel_array[i]["levels"][2] == COLOR_ROAD["levels"][2]) {
                        road_pixel_count++;
                    } else if(pixel_array[i]["levels"][0] == COLOR_GRASS["levels"][0] && pixel_array[i]["levels"][1] == COLOR_GRASS["levels"][1]  && pixel_array[i]["levels"][2] == COLOR_GRASS["levels"][2] ) {
                        grass_pixel_count++;
                    } else {
                        building_pixel_count++;
                    }

                }

                console.log('road: %d grass: %d building %d', road_pixel_count, grass_pixel_count, building_pixel_count);
                // assign prominent structure color
                if(road_pixel_count > building_pixel_count && road_pixel_count > grass_pixel_count) {
                    color_grid[x][y] = COLOR_ROAD;
                } else if(grass_pixel_count > road_pixel_count && grass_pixel_count > building_pixel_count) {
                    color_grid[x][y] = COLOR_GRASS;
                } else if ( building_pixel_count > road_pixel_count && building_pixel_count > grass_pixel_count ) {
                    color_grid[x][y]  = COLOR_BUILDING;
                } else {
                    color_grid[x][y]  = COLOR_BLUE;
                }

                //process each chunk
                // var pixel_array = new Array();
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
                }
            }
        }
        console.log(grid.length);

        // console.log(Jimp.intToRGBA(image.getPixelColor(32,32))["r"]);
        // image.greyscale()
        //     .write('cropped-test.png');
        // // Do stuff with the image.
    })
    .catch(err => {
        console.log('broken');
        // Handle an exception.
    });

    // return color_grid;
}


const grid = createGrid();
// const map = processImage();

function keyPressed() {
    if( keyCode === ENTER ) {
        processImage();
        console.log(COLOR_BLUE["levels"]);
    }
}
function draw() {
    // processImage();
    background(51);
    stroke(COLOR_BLUE);
    // background(51);
    drawGrid(grid);
    // randomPixels();
}