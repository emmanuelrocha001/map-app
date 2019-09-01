// create instance of p5
new p5();
// const Jimp = require('jimp');
const COLOR_BLACK = color(0, 0, 0);
const COLOR_GRAY = color(242, 242, 242);
const COLOR_WHITE = color(255, 255, 255);
const COLOR_BLUE = color(135, 206, 235);
const COLOR_PURPLE = color(0, 91, 156);
const CANVAS_HEIGHT = 640;
const CANVAS_WIDTH = 640;
const cell_size = 32;

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
    var length = CANVAS_WIDTH / 32;
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
            if (grid[x][y].get_visited) {
                fill(COLOR_PURPLE);
            }
            else {
                fill(COLOR_GRAY);
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
    // loadPixels();
    // console.log(pixels);
    var length = 320 / 32;
    map_grid = new Array(length);

    for(var i=0; i < map_grid.length; i++)
    {
        map_grid[i] = new Array(length);
    }

    for(var y=0; y < test_map_image.length; y++)
    {
        for(var x=0; x < test_map_image[0].length; x++)
        {
            // map_grid[x][y] = test_map_image.get(increment*x, increment*y, cell_size);
            console.log(test_map_image[x][y]);

        }
    }

    console.log(map_grid);


}


const grid = createGrid();
// const map = processImage();

function randomPixels() {
    loadPixels();
    // var horizontal_pixel_sections = CANVAS_WIDTH / 4;
    // var vertical_pixel_sections = CANVAS_HEIGHT / 4;
    // console.log(width);

    var pink = color(255, 102, 204);
    pixel_density = pixelDensity();
    var total_pixels = 4 * (CANVAS_WIDTH * pixel_density) * (CANVAS_HEIGHT * pixel_density);

    for( var i=0; i<total_pixels; i++)
    {
        pixels[i] = red(pink);
        pixels[i + 1] = green(pink);
        pixels[i + 2] = blue(pink);
        pixels[i + 3] = alpha(pink);

    }
    updatePixels();
}
function draw() {
    background(51);
    stroke(COLOR_BLUE);
    // background(51);
    drawGrid(grid);
    // randomPixels();
}