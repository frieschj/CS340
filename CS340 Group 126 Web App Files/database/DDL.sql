/*
Brennan Pate and John Friesch
Group 126
CS340
10/26/23
*/



/*
-------------------------------------------------------------------------------------------
Create tables
*/

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;



CREATE OR REPLACE TABLE ParkPasses (
    parkPassID int(2) UNIQUE NOT NULL AUTO_INCREMENT,
    parkPassName varchar(255) NOT NULL,
    PRIMARY KEY (parkPassID) 
);

CREATE OR REPLACE TABLE Environments (
    environmentID int(2) UNIQUE NOT NULL AUTO_INCREMENT,
    environmentName varchar(255) NOT NULL,
    PRIMARY KEY (environmentID)
);

CREATE OR REPLACE TABLE TrailDifficulties (
    difficultyID int(2) UNIQUE NOT NULL AUTO_INCREMENT,
    difficultyName varchar(255) NOT NULL,
    PRIMARY KEY (difficultyID)
);

CREATE OR REPLACE TABLE ParkSystems (
    parkID int(2) UNIQUE NOT NULL AUTO_INCREMENT,
    parkName varchar(255) NOT NULL,
    location varchar(255) NOT NULL,
    parkPassID int(2) NULL,
    PRIMARY KEY (parkID),
    FOREIGN KEY (parkPassID) REFERENCES ParkPasses(parkPassID) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Trails (
    trailID int(2) UNIQUE NOT NULL AUTO_INCREMENT,
    trailName varchar(255) NOT NULL,
    parkID int(2) NOT NULL,
    elevation int(5) NOT NULL,
    difficultyID int(2) NOT NULL,
    length decimal(3, 2) NOT NULL,
    avgTime decimal(3, 2) NOT NULL,
    avalancheRisk varchar(255) NOT NULL,
    PRIMARY KEY (trailID),
    FOREIGN KEY (parkID) REFERENCES ParkSystems(parkID) ON UPDATE CASCADE,
    FOREIGN KEY (difficultyID) REFERENCES TrailDifficulties(difficultyID) ON UPDATE CASCADE
);

CREATE OR REPLACE TABLE TrailEnvironments (
    trailEnvironmentID int(2) UNIQUE NOT NULL AUTO_INCREMENT,
    trailID int(2) NOT NULL,
    environmentID int(2) NOT NULL,
    PRIMARY KEY (trailEnvironmentID),
    FOREIGN KEY (trailID) REFERENCES Trails(TrailID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (environmentID) REFERENCES Environments(EnvironmentID) ON DELETE CASCADE ON UPDATE CASCADE
);

/*
-------------------------------------------------------------------------------------------
Insert data
*/

INSERT INTO ParkPasses
    (parkPassName)
VALUES
    ("National Park Pass"),
    ("Northwest Forest Pass"),
    ("Discover Pass");



INSERT INTO Environments
    (environmentName)
VALUES
    ("Coast"),
    ("Rivers"),
    ("Lakes"),
    ("Waterfalls"),
    ("Meadows"),
    ("Mountains");




INSERT INTO TrailDifficulties
    (difficultyName)
VALUES
    ("Easy"),
    ("Moderate"),
    ("Moderate/Hard"),
    ("Hard");




INSERT INTO ParkSystems
    (parkName,
    location,
    parkPassID)
VALUES
    ("Mount Rainier National Park", "SW", (SELECT parkPassID FROM ParkPasses WHERE parkPassName = "National Park Pass")),
    ("Olympic National Park", "NW", (SELECT parkPassID FROM ParkPasses WHERE parkPassName = "National Park Pass")),
    ("Wallace Falls State Park", "NW", (SELECT parkPassID FROM ParkPasses WHERE parkPassName = "Discover Pass")),
    ("Mount Baker Snoqualmie National Forest", "NW", (SELECT parkPassID FROM ParkPasses WHERE parkPassName = "Northwest Forest Pass"));




INSERT INTO Trails
    (trailName,
    parkID,
    elevation,
    difficultyID,
    length,
    avgTime,
    avalancheRisk)
VALUES
    ("Mount Storm King", (SELECT parkID FROM ParkSystems WHERE parkName = "Olympic National Park"), 2600, (SELECT difficultyID FROM TrailDifficulties WHERE difficultyName = "Moderate/Hard"), 4.1, 4, "Low"),
    ("Skyline Trail Loop", (SELECT parkID FROM ParkSystems WHERE parkName = "Mount Rainier National Park"), 6800, (SELECT difficultyID FROM TrailDifficulties WHERE difficultyName = "Moderate"), 5.7, 3.5, "High"),
    ("Woody Trail", (SELECT parkID FROM ParkSystems WHERE parkName = "Wallace Falls State Park"), 1500, (SELECT difficultyID FROM TrailDifficulties WHERE difficultyName = "Moderate"), 4.9, 3, "Medium"),
    ("Lake 22 Trail", (SELECT parkID FROM ParkSystems WHERE parkName = "Mount Baker Snoqualmie National Forest"), 2400, (SELECT difficultyID FROM TrailDifficulties WHERE difficultyName = "Moderate"), 5.9, 3.25, "Low");




INSERT INTO TrailEnvironments
    (trailID,
    environmentID)
VALUES
    ((SELECT trailID FROM Trails WHERE trailName = "Mount Storm King"), (SELECT environmentID FROM Environments WHERE environmentName = "Lakes")),
    ((SELECT trailID FROM Trails WHERE trailName = "Mount Storm King"), (SELECT environmentID FROM Environments WHERE environmentName = "Mountains")),
    ((SELECT trailID FROM Trails WHERE trailName = "Skyline Trail Loop"), (SELECT environmentID FROM Environments WHERE environmentName = "Rivers")),
    ((SELECT trailID FROM Trails WHERE trailName = "Skyline Trail Loop"), (SELECT environmentID FROM Environments WHERE environmentName = "Waterfalls")),
    ((SELECT trailID FROM Trails WHERE trailName = "Skyline Trail Loop"), (SELECT environmentID FROM Environments WHERE environmentName = "Meadows")),
    ((SELECT trailID FROM Trails WHERE trailName = "Skyline Trail Loop"), (SELECT environmentID FROM Environments WHERE environmentName = "Mountains")),
    ((SELECT trailID FROM Trails WHERE trailName = "Woody Trail"), (SELECT environmentID FROM Environments WHERE environmentName = "Rivers")),
    ((SELECT trailID FROM Trails WHERE trailName = "Woody Trail"), (SELECT environmentID FROM Environments WHERE environmentName = "Lakes")),
    ((SELECT trailID FROM Trails WHERE trailName = "Woody Trail"), (SELECT environmentID FROM Environments WHERE environmentName = "Waterfalls")),
    ((SELECT trailID FROM Trails WHERE trailName = "Woody Trail"), (SELECT environmentID FROM Environments WHERE environmentName = "Mountains")),
    ((SELECT trailID FROM Trails WHERE trailName = "Lake 22 Trail"), (SELECT environmentID FROM Environments WHERE environmentName = "Rivers")),
    ((SELECT trailID FROM Trails WHERE trailName = "Lake 22 Trail"), (SELECT environmentID FROM Environments WHERE environmentName = "Lakes")),
    ((SELECT trailID FROM Trails WHERE trailName = "Lake 22 Trail"), (SELECT environmentID FROM Environments WHERE environmentName = "Waterfalls")),
    ((SELECT trailID FROM Trails WHERE trailName = "Lake 22 Trail"), (SELECT environmentID FROM Environments WHERE environmentName = "Meadows")),
    ((SELECT trailID FROM Trails WHERE trailName = "Lake 22 Trail"), (SELECT environmentID FROM Environments WHERE environmentName = "Mountains"));


SET FOREIGN_KEY_CHECKS=1;
COMMIT;
