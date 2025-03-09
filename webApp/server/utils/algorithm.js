/**
 * @fileOverview Utility functions for formatting coordinates, exchanging data with the openrouteservice API,
 * and comparing route similarities.
 */

/**
 * Converts coordinates from strings to numbers.
 * @param {Array.<string>} coordinates - Array of coordinate strings in the format "[lng,lat]".
 * @returns {Array.<Array.<number>>} Array of coordinate pairs, each containing longitude and latitude as numbers.
 */
export function parseCoordinates(coordinates) {
    return coordinates.map(coordinate => {
        const [lng, lat] = coordinate.replace('[', '').replace(']', '').split(',');
        return [parseFloat(lng), parseFloat(lat)];
    });
}

/**
 * Converts coordinates from arrays of numbers to strings.
 * @param {Array.<Array.<number>>} coordinates - Array of coordinate pairs, each containing longitude and latitude as numbers.
 * @returns {Array.<string>} Array of coordinate strings in the format "[lng,lat]".
 */
export function formatCoordinates(coordinates) {
    return coordinates.map(coord => `[${coord[0]},${coord[1]}]`);
}

/**
 * Finds the longest common subsequence (LCS) between two lists.
 * @param {Array} list1 - First list of elements.
 * @param {Array} list2 - Second list of elements.
 * @returns {Array} The longest common subsequence between the two lists.
 */
function longestCommonSubsequence(list1, list2) {
    const m = list1.length;
    const n = list2.length;
    const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (list1[i - 1].toString() === list2[j - 1].toString()) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const lcs = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (list1[i - 1].toString() === list2[j - 1].toString()) {
            lcs.unshift(list1[i - 1]);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    return lcs;
}

/**
 * Compares two routes and determines their similarity.
 * @param {Object} route1 - First route object containing a "route" property with coordinates as strings.
 * @param {Object} route2 - Second route object containing a "route" property with coordinates as strings.
 * @returns {Object} Contains the longest common subsequence (LCS) and similarity ratio.
 */
function compareRoutes(route1, route2) {
    const coords1 = parseCoordinates(route1.route);
    const coords2 = parseCoordinates(route2.route);
    const lcs = longestCommonSubsequence(coords1, coords2);
    const similarity = lcs.length / Math.min(coords1.length, coords2.length);
    return { lcs, similarity };
}

/**
 * Compares a user route with a set of relevant routes and finds those with a similarity above the threshold.
 * @param {Object} userRoute - User's route object containing a "route" property with coordinates as strings.
 * @param {Array.<Object>} relevantRoutes - Array of route objects to compare against.
 * @param {number} [similarityThreshold=0.5] - Minimum similarity ratio required to consider a route relevant.
 * @returns {Promise<Array.<Object>>} Promise that resolves to an array of relevant routes with similarity details.
 */
export async function compareUserRouteWithRelevantRoutes(userRoute, relevantRoutes, similarityThreshold = 0.5) {
    const similarities = [];
    for (const relevantRoute of relevantRoutes) {
        const { lcs, similarity } = compareRoutes(userRoute, relevantRoute);
        if (similarity > similarityThreshold) {
            similarities.push({ route: relevantRoute, similarity, lcs });
        }
    }
    return similarities;
}
