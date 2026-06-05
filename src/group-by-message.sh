
{
    if (match($0, /^[^:]+\([^)]+\): error /)) {
        paren_colon_pos = index($0, "): ")
        location = substr($0, 1, paren_colon_pos)
        message = substr($0, paren_colon_pos + 3)

        if (!(message in count)) {
            count[message] = 0
            example[message] = location
            order[++order_count] = message
        }
        count[message]++
    }
}
END {
    first = 1
    for (i = 1; i <= order_count; i++) {
        msg = order[i]
        if (!first) print ""
        print msg
        print "├─ occurrences: " count[msg]
        print "└─ example: " example[msg]
        first = 0
    }
}
