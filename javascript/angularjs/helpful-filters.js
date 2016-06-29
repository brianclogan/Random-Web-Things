/*
 * Percentage filter
 * Takes a numeric value, and converts it to a percentage.
 * Example:
 * {{10/100 | percentage}} = 10%
 */
app.filter('percentage', ['$filter', function($filter) {
    return function(input, decimals) {
        if (isNaN(input)) {
            return $filter('number')(0, decimals) + '%';
        } else {
            return $filter('number')(input * 100, decimals) + '%';
        }
    };
}]);

/*
 * Telephone filter
 * Takes a numeric value, and converts it to a pretty (US) telephone number.
 * Example:
 * {{5555555555 | tel}} = (555) 555-5555
 */
app.filter('tel', function() {
    return function(tel) {
        if (!tel) {
            return '';
        }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});

/*
 * Truncate filter
 * Takes a string, and will automatically trim any
 * excess content off the string for you, at your specified
 * length.
 * Example:
 * {{"This is a really long sentance just for demonstration purposes, and has no real meaning or value." | truncate:16:"... [read more]"}} = This is a really... [read more]
 */
app.filter('truncate', function() {
    return function(text, length, end) {
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        } else {
            return String(text).substring(0, length - end.length) + end;
        }

    }
});

/*
 * Unsafe Filter
 * Admit it, you know for some reason when angular-select
 * just keeps throwing an unsafe error, you need something
 * like this....
 * Example:
 * {{"<p>HELLO WORLD</p>" | unsafe}} = <p>HELLO WORLD</p>
 */
app.filter('unsafe', function($sce) {
    return $sce.trustAsHtml;
});

/*
 * Multiple Filter
 * This filter partially replaces the 'filter' on ng-repeats.
 * It allows you to have the results contain multiple words.
 * For example, in a list with 3 names, you can enter two
 * of them, and get those two back, it sepereates the words
 * and searches for them seperately and returns an array
 * with all results from all words.
 * Example:
 * <input type="text" ng-model="search" />
 * <span ng-repeat="a in b | multiple:search">{{a.name}}</span>
 */
app.filter('multiple', ['filterFilter', function(filterFilter) {
    return function(items, query) {
        if (!query) return items;

        var terms = query.split(/\s+/);
        var result = items;
        terms.forEach(function(term) {
            console.log(filterFilter(result, term));
            result = filterFilter(result, term);
        });

        return result;
    }
}]);

/*
 * Second Conversion Filter
 * Truthfully, don't know why I made this, since there are better
 * ways to do it, but it is still in some code...
 */
app.filter('secondConversion', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}]);

/*
 * Trusted Resource Url Filter
 * When using a URL created by Angular in an iframe (for instance),
 * add this onto the end, and it won't throw a fit about
 * 'safe usage'.
 * Example:
 * <iframe src="{{'http://google.com | trustedResourceUrl}}"></iframe>
 */
app.filter('trustedResourceUrl', function($sce) {
    return function(path) {
        return $sce.trustAsResourceUrl(path);
    };
});

/*
 * Regex Filter
 * Replacement for 'filter' on ng-repeats. Allows you to use
 * regex in the search box!
 * Example:
 * <input type="text" ng-model="search" />
 * <span ng-repeat="a in b | regex:'name':search">{{a.name}}</span>
 */
app.filter('regex', function() {
    return function(input, field, regex) {
        if (input === undefined) {
            return input;
        }
        var patt = new RegExp(regex, "i");
        var out = [];
        for (var i = 0; i < input.length; i++) {
            if (patt.test(input[i][field]))
                out.push(input[i]);
        }
        return out;
    };
});
