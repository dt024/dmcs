function fuzzyMatch(searchSet, query) {
    var tokens = query.toLowerCase().split(''),
        matches = [];

    searchSet.forEach(function(string) {
        var tokenIndex = 0,
            stringIndex = 0,
            matchWithHighlights = '',
            matchedPositions = [];

        string = string.toLowerCase();

        while (stringIndex < string.length) {
            if (string[stringIndex] === tokens[tokenIndex]) {
                matchWithHighlights += highlight(string[stringIndex]);
                matchedPositions.push(stringIndex);
                tokenIndex++;

                if (tokenIndex >= tokens.length) {
                    matches.push({
                        match: string,
                        highlighted: matchWithHighlights + string.slice(stringIndex + 1),
                        positions: matchedPositions
                    });

                    break;
                }
            }
            else {
                matchWithHighlights += string[stringIndex];
            }

            stringIndex++;
        }
    });

    return matches;
}

/*function highlight(string) {
    return '<span class="highlight">' + string + '</span>';
}

function search() {
    var query = $('input').first().val(),
        searchSet = ['diffmatch patch.js','diffmatch patch uncompressed.js', 'test'],
        matches = fuzzyMatch(searchSet, query),
        $resultList = $('ul');
    
    $resultList.empty();
    matches.forEach(function(match) {
        $('<li/>').html(match.highlighted).appendTo($resultList);
        console.log('Match: ', match);
    });
}

$('a').click(function() {
    search();
    return false;
});

$('input').keydown(function(e) {
    if (e.which === 13) {
        search();
    }
});