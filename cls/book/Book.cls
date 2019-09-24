/// A persistent class with information about books
Class book.Book Extends %Persistent
{

Property Title As %String(MAXLEN = 220);

Property Author As %String(MAXLEN = 220);

// Property Year As %String(MAXLEN=20);

Property Description As %String(MAXLEN = 22000);

/// Class to clear a book database and insert demo data
ClassMethod ResetDemo() As %Status
{
	set sc=$$$OK
	$$$QuitOnError(..%KillExtent())
	set booksList=##class(util.BooksList).Get()
	for i=0:1:10 { //booksList.%Size()-1 {
		set bookObj=booksList.%Get(i)
		set book=..%New()
		set book.Title=bookObj.title
		set book.Author=bookObj.author
		set book.Description="Published in "_bookObj.country_" in "_bookObj.year
		// set book.Year=bookObj.year
		set sc=book.%Save()
		write i, ":", sc," "
		quit:'sc
	}
	quit sc
}

Storage Default
{
<Data name="BookDefaultData">
<Value name="1">
<Value>%%CLASSNAME</Value>
</Value>
<Value name="2">
<Value>Title</Value>
</Value>
<Value name="3">
<Value>Author</Value>
</Value>
<Value name="4">
<Value>Description</Value>
</Value>
<Value name="5">
<Value>Year</Value>
</Value>
</Data>
<DataLocation>^book.BookD</DataLocation>
<DefaultData>BookDefaultData</DefaultData>
<IdLocation>^book.BookD</IdLocation>
<IndexLocation>^book.BookI</IndexLocation>
<StreamLocation>^book.BookS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}
